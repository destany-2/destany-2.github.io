console.log("Website loaded");
document.querySelector("h1").textContent =
    "Welcome!";
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");

let playing = false;

playBtn.addEventListener("click", () => {

    if (!playing) {
        audio.play();
        playBtn.textContent = "⏸";
        playing = true;
    } else {
        audio.pause();
        playBtn.textContent = "▶";
        playing = false;
    }

});
