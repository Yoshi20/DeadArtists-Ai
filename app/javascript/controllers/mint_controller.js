import { Controller } from "@hotwired/stimulus"
import { ethers } from "ethers";
import { get } from '@rails/request.js'

let numberOfNft = document.getElementById('number-of-nft').value;
let userBalance = 0;
let pricePerNft = 0.05;
let maxNumberOfMints = 10;
let contractAddress = "";

const selectedAddress = async () => {
  while(!window.ethereum.selectedAddress) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

const getContractAddress = async () => {
  let address = "";
  const host = window.location.protocol + '//' + window.location.host;
  const response = await get(host + '/contract_address')
  if (response.ok) address = await response.text;
  else console.erro("Couldn't fetch address!");
  return address;
}

const getAbi = async () => {
  let abi = "";
  const host = window.location.protocol + '//' + window.location.host;
  const response = await get(host + '/abi?contractAddress=' + contractAddress)
  if (response.ok) abi = await response.text;
  else console.erro("Couldn't fetch abi!");
  return abi;
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

// Connects to -> data: { controller: 'mint' }
export default class extends Controller {
  async connect() {
    // Wait until window.ethereum.selectedAddress is defined
    await selectedAddress();
    console.log('userAddress: ', window.ethereum.selectedAddress);//blup
    // Get provider, signer & contract
    window.provider = new ethers.providers.Web3Provider(window.ethereum);
    window.signer = window.provider.getSigner();
    contractAddress =  await getContractAddress();
    const abi = await getAbi();
    window.contract = new ethers.Contract(contractAddress, abi, window.signer);
    // Get & set user balance
    const balance = await window.signer.getBalance();
    userBalance = hexWeiToEth(balance._hex);
    console.log('userBalance: ', userBalance);//blup
    document.getElementById('user-balance').innerHTML = userBalance;

    // Get & set userNumberOfMints
    const userNumberOfMints = await window.signer.getTransactionCount();
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
    // Get & set maxSupply
    // const maxSupply =  parseInt((await window.contract.maxSupply())._hex, 16);
    const maxSupply =  5000;//blup: can be static
    console.log('maxSupply: ', maxSupply);//blup
    document.getElementById('max-supply').innerHTML = maxSupply;
    // Get & set totalSupply
    const totalSupply =  parseInt((await window.contract.totalSupply())._hex, 16);
    console.log('totalSupply: ', totalSupply);//blup
    document.getElementById('total-supply').innerHTML = totalSupply;
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
    const mintButtonText = document.getElementById("mint-button-text");
    mintButtonText.innerHTML = '<div class="dot-windmill"></div>';
    // Mint
    try {
      const response = await contract.mint(numberOfNft, {
        value: ethStrToWei(totalPrice(numberOfNft).toString()),
      });
      console.log(response); // data: "0xa0712d680000000000000000000000000000000000000000000000000000000000000001"
      //blup
      // const url = `https://rinkeby.etherscan.io/tx/${mintTransaction.transactionHash}`;
      // console.log("Minted successfully!", `Transaction Hash: ${mintTransaction.transactionHash}`);
      // status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    } catch(err) {
      console.warn(err.code);
      if (err.code != 'ACTION_REJECTED' && err.code != '4001') {
        alert("😥 Something went wrong: " + err.code + " 😥");
      }
    }
    // Reeable everything and hide spinner
    document.getElementById("mint-button").disabled = false;
    document.getElementById("sub-button").disabled = false;
    document.getElementById("add-button").disabled = false;
    document.getElementById("set-field").style.pointerEvents = '';
    mintButtonText.innerHTML = 'Mint';
  }
}
