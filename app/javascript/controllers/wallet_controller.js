import { Controller } from "@hotwired/stimulus"
import detectEthereumProvider from '@metamask/detect-provider'

let userAddress = undefined;

// Connects to -> data: { controller: 'wallet' }
export default class extends Controller {

  async connect() {
    // Check if MetaMask is installed, show download-metamask-button otherwise
    const provider = await detectEthereumProvider();
    if (provider) {
      // Check if there's already an active account
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          userAddress = addressArray[0];
          document.getElementById('connect-wallet-button').style.display = 'none';
          let wallet_connected_button = document.getElementById('wallet-connected-button')
          let userAddressShort = addressArray[0].substring(0, 5) + "..." + addressArray[0].slice(-4);
          wallet_connected_button.innerHTML = "Connected wallet: " + userAddressShort + wallet_connected_button.innerHTML;
          wallet_connected_button.style.display = '';
          document.getElementById('wallet-connected').style.display = '';
        }
      } catch (err) {
        console.error(err.message);
      }

      // add event listener
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          document.getElementById('connect-wallet-button').style.display = 'none';
          //blup...
        } else {
          window.location.reload(); // reload page in this case
        }
      });
    } else {
      document.getElementById('connect-wallet-button').style.display = 'none';
      document.getElementById('download-metamask-button').style.display = '';
    }
  }

  // Triggers with -> data: { action: "click->wallet#connect_wallet" }
  async connect_wallet() {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (addressArray.length > 0) {
          userAddress = addressArray[0]; // -> window.ethereum.selectedAddress
          document.getElementById('connect-wallet-button').style.display = 'none';
          let wallet_connected_button = document.getElementById('wallet-connected-button')
          let userAddressShort = addressArray[0].substring(0, 5) + "..." + addressArray[0].slice(-4);
          wallet_connected_button.innerHTML = "Connected wallet: " + userAddressShort + wallet_connected_button.innerHTML;
          wallet_connected_button.style.display = '';
          document.getElementById('wallet-connected').style.display = '';
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      document.getElementById('connect-wallet-button').style.display = 'none';
      document.getElementById('download-metamask-button').style.display = '';
      if (!this.element.classList.contains('no-wallet-yet')) {
        this.element.innerHTML = this.element.innerHTML +
          "<br><br><span><p>You don't seem to have the <a class= \"color-default\" target=\"_blank\" href=\"https://metamask.io/download.html\">MetaMask</a> browser extension installed yet 😥</p></span>";
        this.element.classList.add('no-wallet-yet');
      }
    }
  }
}

// Chain IDs:
// Hex 		Dec 	Network
// 0x1 		1 		Ethereum Main Network (Mainnet)
// 0x3 		3 		Ropsten Test Network
// 0x4 		4 		Rinkeby Test Network
// 0x5	 	5 		Goerli Test Network
// 0x2a 	42 		Kovan Test Network
