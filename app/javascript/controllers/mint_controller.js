import { Controller } from "@hotwired/stimulus"

const selectedAddress = async () => {
  while(!window.ethereum.selectedAddress) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Connects to -> data: { controller: 'mint' }
export default class extends Controller {
  async connect() {
    // wait until window.ethereum.selectedAddress is defined
    const userAddress = await selectedAddress();
    // Get user balance
    try {
      const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [userAddress, "latest"] });
      console.log(balance);
    } catch (err) {
      console.error(err.message);
    }
  }

  async mint() {
    console.log('mint');

  }

}
