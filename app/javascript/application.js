// Entry point for the build script in your package.json
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
