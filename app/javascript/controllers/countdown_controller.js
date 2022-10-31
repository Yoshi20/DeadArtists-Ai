import { Controller } from "@hotwired/stimulus"

// Connects to -> data: { controller: 'countdown' }
export default class extends Controller {

  disconnect() {
    clearInterval(this.countdownInterval);
    this.countdownInterval = 0;
  }

  connect() {
    const t = this;
    const endDate = t.element.querySelector('#countdown-end-date').innerHTML;
    console.log(endDate);//blup
    const endDateTest = new Date().getTime() + 12000;//blup: only for testing
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    // const countDown = new Date(endDate).getTime(); //blup
    const countDown = new Date(endDateTest).getTime();
    t.countdownInterval = setInterval(function() {
      const now = new Date().getTime();
      const distance = countDown - now;
      if (distance < 0) {
        // do something when end date is reached
        const headline = t.element.querySelector('#headline');
        headline.innerText = t.element.querySelector('#new-headline').innerText;
        let a = document.createElement("a");
        a.classList.add('color-default');
        a.classList.add('refresh-link');
        a.innerHTML = '-> Refresh page <-';
        a.href = '/mint'
        headline.parentElement.appendChild(a);
        // t.element.querySelector('#countdown').style.display = "none";
        clearInterval(t.countdownInterval);
        t.countdownInterval = 0;
      } else {
        t.element.querySelector('#days').innerText = Math.floor(distance / (day));
        t.element.querySelector('#hours').innerText = Math.floor((distance % (day)) / (hour));
        t.element.querySelector('#minutes').innerText = Math.floor((distance % (hour)) / (minute));
        t.element.querySelector('#seconds').innerText = Math.floor((distance % (minute)) / second);
      }
    }, 1000)
  }
}
