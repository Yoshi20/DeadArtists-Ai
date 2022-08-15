import { Controller } from "@hotwired/stimulus"

// Connects to -> data: { controller: 'submit-closest-form' }
export default class extends Controller {
  connect() {
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure?')) {
        this.element.closest('form').submit()
      }
    });
  }
}
