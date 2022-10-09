import { Controller } from "@hotwired/stimulus"

// Connects to -> data: { controller: 'hide-back-arrows' }
export default class extends Controller {
  connect() {
    if (window.location.pathname != "/nfts") {
      let back_arrows = document.getElementsByClassName('back-arrow');
      for (let back_arrow of back_arrows) {
        back_arrow.style.display = 'none';
      }
    }
  }
}
