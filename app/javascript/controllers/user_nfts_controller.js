import { Controller } from "@hotwired/stimulus";
import { get } from '@rails/request.js';

const selectedAddress = async () => {
  while(!window.ethereum.selectedAddress) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Connects to -> data: { controller: 'user-nfts' }
export default class extends Controller {

  async connect() {
    // Wait until window.ethereum.selectedAddress is defined
    await selectedAddress();
    console.log('userAddress: ', window.ethereum.selectedAddress);//blup
    // Get user NFTs
    const userNfts = document.getElementById('user-nfts');
    if (userNfts) {
      userNfts.src = '/get_user_nfts?userAddress=' + window.ethereum.selectedAddress
      console.log('userNfts.src: ', userNfts.src);//blup
      userNfts.reload();
    }
  }

}