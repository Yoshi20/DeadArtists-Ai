import { Controller } from "@hotwired/stimulus";
import { ethers } from "ethers";
import { get } from '@rails/request.js';
const { MerkleTree } = require('merkletreejs'); // for whitelist minting

let numberOfNft = document.getElementById('number-of-nft') ? document.getElementById('number-of-nft').value : 1;
let userBalance = 0;
let pricePerNft = 0.04;
let maxNumberOfMints = 10;
let contractAddress = "";

const selectedAddress = async () => {
  while(!window.ethereum.selectedAddress) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

const getContractAddress = async () => {
  let address = "";
  const response = await get(window.location.origin + '/contract_address')
  if (response.ok) address = await response.text;
  else console.erro("Couldn't fetch address!");
  return address;
}

const getAbi = async () => {
  let abi = "";
  const response = await get(window.location.origin + '/abi?contractAddress=' + contractAddress)
  if (response.ok) abi = await response.text;
  else console.erro("Couldn't fetch abi!");
  return abi;
}

const getUserNfts = async (userAddress) => {
  let user_nfts;
  const response = await get(window.location.origin + '/user_nfts?contractAddress=' + contractAddress + '&userAddress=' + userAddress)
  if (response.ok) user_nfts = await response.text;
  else console.erro("Couldn't fetch user_nfts!");
  return user_nfts;
}

const getWhitelistAddresses = async () => {
  let whitelist_addresses;
  const response = await get(window.location.origin + '/whitelist_addresses')
  if (response.ok) whitelist_addresses = await response.text;
  else console.erro("Couldn't fetch whitelist_addresses!");
  return whitelist_addresses;
}

const totalPrice = (n) => {
  return Math.round(n * pricePerNft * 1000) / 1000;
}

const hexWeiToEth =  (hexWei) => {
  return Math.round(parseInt(hexWei, 16) / 1000000000000000000 * 1000) / 1000;
}

const ethStrToWei = (ethStr) => {
  return ethers.utils.parseEther(ethStr);
}

const handleNumberOfNft = (n) => {
  document.getElementById('number-of-nft').value = n;
  let tp = totalPrice(n);
  document.getElementById('total-price').innerHTML = tp;
  let mintErrorMessage = document.getElementById('mint-error-message');
  if (tp > userBalance) {
    mintErrorMessage.style.display = '';
    document.getElementById('mint-button').disabled = true;
  } else {
    mintErrorMessage.style.display = 'none';
    document.getElementById('mint-button').disabled = false;
  }
  document.getElementById('number-of-nft').value = n;
}

let randomNftInterval = 0;

// Connects to -> data: { controller: 'mint' }
export default class extends Controller {

  disconnect() {
    clearInterval(randomNftInterval);
    randomNftInterval = 0;
  }

  async connect() {
    // Show random NFT
    if (!randomNftInterval) {
      randomNftInterval = setInterval(() => {document.getElementById('random-nft').firstElementChild.click();}, 5000);
    }
    // Set numberOfNft
    document.getElementById('number-of-nft').value = numberOfNft;
    // Wait until window.ethereum.selectedAddress is defined
    await selectedAddress();
    console.log('userAddress: ', window.ethereum.selectedAddress);//blup
    // Get provider, signer & contract
    window.provider = new ethers.providers.Web3Provider(window.ethereum);
    window.signer = window.provider.getSigner();
    contractAddress = await getContractAddress();
    const abi = await getAbi();
    window.contract = new ethers.Contract(contractAddress, abi, window.signer);
    // Get & set user balance
    const balance = await window.signer.getBalance();
    userBalance = hexWeiToEth(balance._hex);
    console.log('userBalance: ', userBalance);//blup
    document.getElementById('user-balance').innerHTML = userBalance;
    // Get & set userNumberOfMints
    const userTokenBalance = await window.contract.balanceOf(window.ethereum.selectedAddress);
    const userNumberOfMints = parseInt(userTokenBalance._hex, 16);
    console.log('userNumberOfMints: ', userNumberOfMints);//blup
    document.getElementById('user-number-of-mints').innerHTML = userNumberOfMints;
    // Get & set maxNumberOfMints
    // const maxMintAmountPerTx = await window.contract.maxMintAmountPerTx();
    // maxNumberOfMints = parseInt(maxMintAmountPerTx._hex, 16) - userNumberOfMints;
    maxNumberOfMints = 10 - userNumberOfMints;//blup: can be static
    if (maxNumberOfMints < 0) maxNumberOfMints = 0;
    console.log('remaining maxNumberOfMints: ', maxNumberOfMints);//blup
    document.getElementById('max-number-of-mints').innerHTML = maxNumberOfMints + userNumberOfMints;
    // Get & set pricePerNft
    const cost = await window.contract.cost();
    pricePerNft = hexWeiToEth(cost._hex);
    console.log('pricePerNft: ', pricePerNft);//blup
    handleNumberOfNft(document.getElementById('number-of-nft').value);
    // Minting may be enabled from here on -------------------------------------
    // Get & set maxSupply
    // const maxSupply =  parseInt((await window.contract.maxSupply())._hex, 16);
    const maxSupply =  5000;//blup: can be static
    console.log('maxSupply: ', maxSupply);//blup
    document.getElementById('max-supply').innerHTML = maxSupply;
    // Get & set totalSupply
    const totalSupply =  parseInt((await window.contract.totalSupply())._hex, 16);
    console.log('totalSupply: ', totalSupply);//blup
    document.getElementById('total-supply').innerHTML = totalSupply;
    // Get user NFTs
    //const user_nfts = await getUserNfts(window.ethereum.selectedAddress); //blup: WIP
  }

  add() {
    numberOfNft++;
    if (numberOfNft > maxNumberOfMints) numberOfNft = maxNumberOfMints;
    handleNumberOfNft(numberOfNft);
  }

  sub() {
    numberOfNft--;
    if (numberOfNft < 1) numberOfNft = 1;
    if (numberOfNft > maxNumberOfMints) numberOfNft = maxNumberOfMints; // in case max is 0
    handleNumberOfNft(numberOfNft);
  }

  set() {
    numberOfNft = document.getElementById('number-of-nft').value;
    if (numberOfNft < 1) numberOfNft = 1;
    if (numberOfNft > maxNumberOfMints) numberOfNft = maxNumberOfMints;
    handleNumberOfNft(numberOfNft);
  }

  async mint() {
    // Disable everything and show spinner
    document.getElementById("mint-button").disabled = true;
    document.getElementById("sub-button").disabled = true;
    document.getElementById("add-button").disabled = true;
    document.getElementById("set-field").style.pointerEvents = 'none';
    document.getElementById('mint-success-message-row').style.display = 'none';
    const mintButtonText = document.getElementById("mint-button-text");
    mintButtonText.innerHTML = '<div class="dot-windmill"></div>';
    // Mint
    try {
      // Whitelist minting:
      let whitelistAddresses = await getWhitelistAddresses();
      whitelistAddresses = atob(whitelistAddresses.slice(2)).split(' ');
      const leafNodes = whitelistAddresses.map(addr => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(addr)));
      const DeadArtistsMerkleTree = new MerkleTree(leafNodes, ethers.utils.keccak256, {sortPairs: true});
      //console.log(DeadArtistsMerkleTree.toString()); // shows a required info for the SmartContract
      const whitelistAddressesLowerCase = whitelistAddresses.map(addr => addr.toLowerCase());
      if (whitelistAddressesLowerCase.indexOf(window.ethereum.selectedAddress.toLowerCase()) >= 0) {
        const claimingAddress = ethers.utils.keccak256(window.ethereum.selectedAddress);
        const hexProof = DeadArtistsMerkleTree.getHexProof(claimingAddress);
        const response = await contract.mintWL(numberOfNft, hexProof, {
          value: ethStrToWei(totalPrice(numberOfNft).toString()),
        });
        console.log(response);
      } else {
        throw new Error("NOT_ON_THE_WHITELIST", {cause: "😥 Sorry, you're not on the whitelist 😥"});
      }
      // ---------------------
      //blup: Public minting:
      // const response = await contract.mint(numberOfNft, {
      //   value: ethStrToWei(totalPrice(numberOfNft).toString()),
      // });
      // console.log(response);
      // data: "0xa0712d680000000000000000000000000000000000000000000000000000000000000001"
      // from: "0x07b8Eed7161Fbd77da9e0276Abea19b22fc168B6"
      // gasLimit: Object { _hex: "0x0146c5", _isBigNumber: true }
      // gasPrice: Object { _hex: "0x59682f0b", _isBigNumber: true }
      // hash: "0x54228e71678b0fbec7236b825324299bfe55cf5f4acb758de582dfc54fae002b"
      // maxFeePerGas: Object { _hex: "0x59682f0b", _isBigNumber: true }
      // maxPriorityFeePerGas: Object { _hex: "0x59682f00", _isBigNumber: true }
      // nonce: 3
      // to: "0x766d47c9991CbA47Adc5F7F8Da3b1E619540D756"
      // value: Object { _hex: "0x11c37937e08000", _isBigNumber: true }
      // ---------------------
      // Show "Mint succeeded!"
      let url = 'https://goerli.etherscan.io/tx/' + response.hash; //blup: goerli for now
      let p = document.createElement("p");
      p.innerHTML = 'Check out your transaction on <a target=_blank class=color-default href=' + url + '>Etherscan</a>';
      let parent = document.getElementById('mint-success-message-text').parentElement;
      if (parent.lastChild.tagName == "P") { parent.lastChild.remove(); }
      parent.appendChild(p);
      document.getElementById('mint-success-message-row').style.display = '';
    } catch(err) {
      if (err.code) {
        console.warn(err.code);
        if (err.code != 'ACTION_REJECTED' && err.code != '4001') {
          alert("😥 Something went wrong: " + err.code + " 😥");
        }
      } else if (err.cause) {
        alert(err.cause);
      }
    }
    // Reeable everything and hide spinner
    document.getElementById("mint-button").disabled = false;
    document.getElementById("sub-button").disabled = false;
    document.getElementById("add-button").disabled = false;
    document.getElementById("set-field").style.pointerEvents = '';
    mintButtonText.innerHTML = 'Whitelist Mint'; //blup: 'Mint';
  }

}
