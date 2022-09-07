import { Controller } from "@hotwired/stimulus"

// Connects to -> data: { controller: 'welcome' }
export default class extends Controller {
  connect() {

  }

  // Triggers with -> data: { action: "click->welcome#enter" }
  enter(e) {
    e.preventDefault();
    document.getElementById('primary').style.display= '';
    document.getElementById('overlay').style.display= 'none';
    document.getElementById('home-title-video').currentTime = 0;
    window.scrollTo(0, 0);
  }

  // Triggers with -> data: { action: "click->welcome#start_picasso_frame" }
  start_picasso_frame() {
    document.getElementById('visible-picasso-frame').style.display = 'none';
    let hidden_picasso_frame = document.getElementById('hidden-picasso-frame');
    hidden_picasso_frame.style.display = 'inline-block';
    hidden_picasso_frame.getElementsByTagName('video')[0].currentTime = 0;
    hidden_picasso_frame.getElementsByTagName('video')[0].play();
    setTimeout(() => {document.getElementById('enter-arrows').style.display = '';}, 5000);
  }

  // Triggers with -> data: { action: "click->welcome#stop_picasso_frame" }
  stop_picasso_frame() {
    document.getElementById('hidden-picasso-frame').style.display = 'none';
    document.getElementById('visible-picasso-frame').style.display = 'inline-block';
  }

}
