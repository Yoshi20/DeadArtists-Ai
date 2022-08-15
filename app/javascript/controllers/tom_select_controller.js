import { Controller } from "@hotwired/stimulus"
import TomSelect      from "tom-select"

// Connects to -> data: { controller: 'tom-select' }
export default class extends Controller {
  connect() {
    var eventHandler = function(name) {
    	return function() {
    		console.log(name, arguments);
        console.log(arguments[0]);
        window.location.href = 'artists/' + arguments[0];
    	};
    };
    new TomSelect(this.element, {
    	create: true,
    	sortField: {
    		field: "text",
    		direction: "asc"
    	},
	     onChange: eventHandler('onChange'),
    });
  }
}
