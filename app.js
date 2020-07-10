// Variables ----------
const progressBar = document.querySelector(".e-c-progress");
const length = Math.PI * 2 * 100;

const displayOutput = document.querySelector(".display-remain-time");
const pauseBtn = document.getElementById("pause");
const startBtn = document.querySelector(".start-btn");
const resetBtn = document.querySelector(".reset-btn");
const setterBtns = document.querySelectorAll("button[data-setter]");

let intervalTimer;
let timeLeft;
let originalTime = 5; // this sets default starting time (eg. 00:30)
let wholeTime = originalTime;
let isPaused = false;
let isPlaying = false;
let isReset = false;

// Update progress bar length ---------
progressBar.style.strokeDasharray = length;

function update(value, timePercent) {
    let offset = -length - (length * value) / timePercent;
    progressBar.style.strokeDashoffset = offset;
}

//refresh progress bar --------
update(wholeTime, wholeTime);
displayTimeLeft(wholeTime);

// Change the time-number displayed & update progress bar ----------
function changeWholeTime(seconds) {
    if (wholeTime + seconds > 0) {
        wholeTime += seconds;
        update(wholeTime, wholeTime);
    }
}

// Allocate times for setter buttons -----------------
for (let i = 0; i < setterBtns.length; i++) {
    setterBtns[i].addEventListener("click", function () {
        let param = this.dataset.setter;
        switch (param) {
            case "plus-20-min":
                changeWholeTime(20 * 60);
                break;
            case "plus-5-min":
                changeWholeTime(5 * 60);
                break;
            case "plus-1-min":
                changeWholeTime(1 * 60);
                break;
            case "plus-30-sec":
                changeWholeTime(30);
                break;
            case "plus-20-sec":
                changeWholeTime(20);
                break;
            case "plus-5-sec":
                changeWholeTime(5);
                break;
        }
        displayTimeLeft(wholeTime);
    });
}

// Display/format time according to input ----------------
function displayTimeLeft(timeLeft) {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let displayString = `${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
    }${seconds}`;

    displayOutput.textContent = displayString;

    if (timeLeft < 4) {
        progressBar.classList.add("progress-end");
    }

    update(timeLeft, wholeTime);
}

// calculate remaining time & display, every second ------------------------
function timer(seconds) {
    let remainTime = Date.now() + seconds * 1000;
    displayTimeLeft(seconds);

    intervalTimer = setInterval(function () {
        timeLeft = Math.round((remainTime - Date.now()) / 1000);

        // if timer is 0, clear interval and enable setter buttons
        if (timeLeft < 0) {
            clearInterval(intervalTimer);
            isPlaying = false;
            setterBtns.forEach(function (btn) {
                btn.disabled = false;
                btn.style.opacity = 1;
            });

            displayTimeLeft(wholeTime);
            startBtn.textContent = "START";
            progressBar.classList.remove("progress-end");

            return;
        }
        displayTimeLeft(timeLeft);
    }, 1000);
}

// Pause & Play Timer -----------------
function pausePlayTimer() {
    if (isPlaying === false) {
        timer(wholeTime);
        isPlaying = true;
        startBtn.textContent = "PAUSE";

        // disable setter buttons when timer is playing
        setterBtns.forEach(function (btn) {
            btn.disabled = true;
            btn.style.opacity = 0.5;
            btn.style.cursor = "default";
        });
    } else if (isPaused) {
        startBtn.textContent = "PAUSE";
        timer(timeLeft);
        isPaused = isPaused ? false : true;
    } else {
        startBtn.textContent = "PLAY";
        clearInterval(intervalTimer);
        isPaused = isPaused ? false : true;
    }
}

startBtn.addEventListener("click", pausePlayTimer);

// reset timer -----------------
function resetTimer() {
    isPlaying = false;
    isPaused = false;
    clearInterval(intervalTimer);
    wholeTime = originalTime;
    update(wholeTime, wholeTime);
    displayTimeLeft(wholeTime);

    startBtn.textContent = "START";
    progressBar.classList.remove("progress-end");

    setterBtns.forEach(function (btn) {
        btn.disabled = false;
        btn.style.opacity = 1;
    });
}

resetBtn.addEventListener("click", resetTimer);
