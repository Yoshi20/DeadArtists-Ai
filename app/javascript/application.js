// Entry point for the build script in your package.json

// beercss@2.1.3
import "beercss/dist/cdn/beer.min.js"

import "@hotwired/turbo-rails"
import "./controllers"

// fix for beercss forms with hotwire
document.addEventListener("turbo:load", function (e) {
  if (ui != undefined) {
    ui();
  }
})

// Uncomment to disable hotwire
// import { Turbo } from "@hotwired/turbo-rails"
// Turbo.session.drive = false
