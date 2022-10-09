import { Controller } from "@hotwired/stimulus"
import TomSelect      from "tom-select"
import { Turbo }      from "@hotwired/turbo-rails"

// Connects to -> data: { controller: 'tom-select' }
export default class extends Controller {
  connect() {
    let eventHandler = function(name, element) {
      return function() {
        let type_and_value = arguments[0].split('_');
        if (type_and_value[0] == 'artist') {
          Turbo.visit('/nfts?artist_id=' + type_and_value[1], { action: "replace" });
        } else if (type_and_value[0] == 'painting') {
          Turbo.visit('/nfts?painting_id=' + type_and_value[1], { action: "replace" });
        } else {
          Turbo.visit('/nfts', { action: "replace" });
        }
      };
    };

    new TomSelect(this.element, {
      allowEmptyOption: true,
      onChange: eventHandler('onChange', this.element),
      maxOptions: null,
    });
  }
}
