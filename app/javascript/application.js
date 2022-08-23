// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"

document.addEventListener("turbo:load", function (e) {
  // fix for beercss forms with hotwire
  if (ui != undefined) {
    ui();
  }

  // background video: set random start time
  document.getElementById("background-video").currentTime = Math.floor(Math.random()*5); // 5 = max video duration
})

// Uncomment to disable hotwire
// import { Turbo } from "@hotwired/turbo-rails"
// Turbo.session.drive = false
