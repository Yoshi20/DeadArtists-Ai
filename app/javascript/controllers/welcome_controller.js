import { Controller } from "@hotwired/stimulus"

// Connects to -> data: { controller: 'welcome' }
export default class extends Controller {
  connect() {

  }

  enter(e) {
    e.preventDefault();
    document.getElementById('primary').style.display= '';
    document.getElementById('overlay').style.display= 'none';
    document.getElementById('home-title-video').currentTime = 0;
    window.scrollTo(0, 0);
  }

}
