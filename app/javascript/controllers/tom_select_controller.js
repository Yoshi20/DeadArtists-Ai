import { Controller } from "@hotwired/stimulus"
import TomSelect      from "tom-select"
import { Turbo }      from "@hotwired/turbo-rails"

// Connects to -> data: { controller: 'tom-select' }
export default class extends Controller {
  connect() {
    var eventHandler = function(name, element) {
      return function() {
        if (element.dataset.resource == 'artists') {
          Turbo.visit('/nfts?artist_id=' + arguments[0], { action: "replace" });
        } else {
          Turbo.visit('/nfts?painting_id=' + arguments[0], { action: "replace" });
        }
      };
    };
    new TomSelect(this.element, {
      allowEmptyOption: true,
      onChange: eventHandler('onChange', this.element),
    });
  }
}
