import { Controller } from "@hotwired/stimulus"

let countdownInterval = 0;

// Connects to -> data: { controller: 'countdown' }
export default class extends Controller {

  disconnect() {
    clearInterval(countdownInterval);
    countdownInterval = 0;
  }

  connect() {
    const publicMintingStartDate = document.getElementById('public-minting-start-date').innerHTML;
    console.log(publicMintingStartDate);//blup
    const endDate = new Date().getTime() + 32000;//blup: only for testing
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    //blup const countDown = new Date(publicMintingStartDate).getTime();
    const countDown = new Date(endDate).getTime();
    countdownInterval = setInterval(function() {
      const now = new Date().getTime();
      const distance = countDown - now;
      document.getElementById("days").innerText = Math.floor(distance / (day));
      document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour));
      document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute));
      document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
      //do something later when date is reached
      if (distance < 0) {
        const headline = document.getElementById("headline");
        headline.innerText = "Public Minting started!";
        let a = document.createElement("a");
        a.classList.add('color-default');
        a.classList.add('refresh-link');
        a.innerHTML = '-> Refresh page <-';
        a.href = '/mint'
        headline.parentElement.appendChild(a);
        document.getElementById("countdown").style.display = "none";
        clearInterval(countdownInterval);
      }
      //seconds
    }, 0)
  }
}
