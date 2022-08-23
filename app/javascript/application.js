// Entry point for the build script in your package.json

// beercss@2.1.3
import "beercss/dist/cdn/beer.min.js"

import "@hotwired/turbo-rails"
import "./controllers"

document.addEventListener("turbo:load", function (e) {
  // fix for beercss forms with hotwire
  if (ui != undefined) {
    ui();
  }

  // background video: set random start time
  let vid = document.getElementById("background-video")
  if (vid != undefined) {
    vid.currentTime = Math.floor(Math.random()*5); // 5 = max video duration
  }
})

// Uncomment to disable hotwire
// import { Turbo } from "@hotwired/turbo-rails"
// Turbo.session.drive = false
