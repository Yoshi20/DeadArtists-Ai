import { Controller } from "@hotwired/stimulus"

const PRICE_PER_NFT = 0.05; // blup: hardcoded for now
const MAX_NUMBER_OF_MINTS_PER_WALLET = 10;  //blup: is not guaranteed yet!

const selectedAddress = async () => {
  while(!window.ethereum.selectedAddress) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
const totalPrice = (n) => {
  return Math.round(n * PRICE_PER_NFT * 1000) / 1000;
}

let numberOfNft = document.getElementById('number-of-nft').value;
let userBalance = 0;

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
    // wait until window.ethereum.selectedAddress is defined
    await selectedAddress();
    console.log(window.ethereum.selectedAddress);//blup
    // Get user balance
    try {
      let balance = await window.ethereum.request({ method: 'eth_getBalance', params: [window.ethereum.selectedAddress, "latest"] });
      balance = Math.round(parseInt(balance, 16) / 1000000000000000000 * 1000) / 1000;
      userBalance = balance;
      console.log(userBalance);//blup
      document.getElementById('user-balance').innerHTML = userBalance;
    } catch (err) {
      console.error(err.message);
    }
    handleNumberOfNft(document.getElementById('number-of-nft').value);
  }

  add() {
    numberOfNft++;
    if (numberOfNft > MAX_NUMBER_OF_MINTS_PER_WALLET) numberOfNft = MAX_NUMBER_OF_MINTS_PER_WALLET;
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
    if (numberOfNft > MAX_NUMBER_OF_MINTS_PER_WALLET) numberOfNft = MAX_NUMBER_OF_MINTS_PER_WALLET;
    handleNumberOfNft(numberOfNft);
  }

  async mint() {
    alert('Mint test; numberOfNft = ' + numberOfNft + '; totalPrice = ' + totalPrice(numberOfNft));
  }

}
