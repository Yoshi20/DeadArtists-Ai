import { Controller } from "@hotwired/stimulus"
import { ethers } from "ethers";
import { get } from '@rails/request.js'

let numberOfNft = document.getElementById('number-of-nft').value;
let userBalance = 0;
let pricePerNft = 0.05;
let maxNumberOfMintsPerWallet = 10;
const CONTRACT_ADDRESS = '0x3E78776897f90D4279a0A64e1ceEbe5fE75028e9';

const selectedAddress = async () => {
  while(!window.ethereum.selectedAddress) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

const getAbi = async () => {
  let abi = "";
  const host = window.location.protocol + '//' + window.location.host;
  const response = await get(host + '/abi?contractAddress=' + CONTRACT_ADDRESS)
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
    const abi = await getAbi();
    window.contract = new ethers.Contract(CONTRACT_ADDRESS, abi, window.signer);
    // Get & set user balance
    const balance = await window.signer.getBalance();
    userBalance = hexWeiToEth(balance._hex);
    console.log('userBalance: ', userBalance);//blup
    document.getElementById('user-balance').innerHTML = userBalance;
    // Get & set maxNumberOfMintsPerWallet
    // const maxMintAmountPerTx = await window.contract.maxMintAmountPerTx();
    // maxNumberOfMintsPerWallet = parseInt(maxMintAmountPerTx._hex, 16);
    maxNumberOfMintsPerWallet = 10;//blup: can be static
    console.log('maxNumberOfMintsPerWallet: ', maxNumberOfMintsPerWallet);//blup
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


    console.log('transactionCount: ', await window.signer.getTransactionCount());//blup
    console.log(await window.contract.name());//blup
  }

  add() {
    numberOfNft++;
    if (numberOfNft > maxNumberOfMintsPerWallet) numberOfNft = maxNumberOfMintsPerWallet;
    handleNumberOfNft(numberOfNft);
  }

  sub() {
    numberOfNft--;
    if (numberOfNft < 1) numberOfNft = 1;
    handleNumberOfNft(numberOfNft);
  }

  set() {
    numberOfNft = document.getElementById('number-of-nft').value;
    if (numberOfNft < 1) numberOfNft = 1;
    if (numberOfNft > maxNumberOfMintsPerWallet) numberOfNft = maxNumberOfMintsPerWallet;
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
      if (err.code != 'ACTION_REJECTED') {
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
