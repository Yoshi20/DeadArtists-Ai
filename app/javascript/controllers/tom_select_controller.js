import { Controller } from "@hotwired/stimulus"
import TomSelect      from "tom-select"

// Connects to -> data: { controller: 'tom-select' }
export default class extends Controller {
  connect() {
    var eventHandler = function(name, element) {
    	return function() {
        window.location.href = element.dataset.resource + '/' + arguments[0];
    	};
    };
    new TomSelect(this.element, {
    	create: true,
    	sortField: {
    		field: "text",
    		direction: "asc"
    	},
	     onChange: eventHandler('onChange', this.element),
    });
  }
}
