// #region Constants

/**
 * HTML element
 * @type {HTMLElement | null}
 */
const MINUTES_HUNDREDS = document.getElementById("minutes-hundreds");

const MINUTES_TENS = document.getElementById("minutes-tens");

const MINUTES_UNITS = document.getElementById("minutes-units");

const SECONDS_TENS = document.getElementById("seconds-tens");

const SECONDS_UNITS = document.getElementById("seconds-units");

const INPUT = document.getElementById("terminal-input-area");

// #endregion Constants

// #region Domain Logic

class CustomAudio extends Audio{
    stop() {
        this.pause()
        this.currentTime = 0;
      }
  }

const ALARM = new CustomAudio("assets/sounds/alarm.mp3");

/**
 * Class to generate timer
 */
class Timer {

    #date = new Date();

/**
 * Sets the number of minutes for the timer
 * @param {number} timerLength 
 */
    constructor(timerLength){

       // this.countdownDate = this.#date.setMinutes(this.#date.getMinutes() + timerLength);
       this.countdownDate = this.#date.getTime() + timerLength * 1000;
    }

/**
 * Extracts the minutes from the milliseconds returned by Date and rounds them down
 * @param {number} distance 
 * @returns {number}
 */
    getMinutes(distance){
        return Math.floor((distance / 60000));
    }

/**
 * Extracts the seconds from the milliseconds returned by Date and rounds them down
 * @param {number} distance 
 * @returns {number}
 */
    getSeconds(distance){
        return Math.floor((distance % (1000 * 60)) / 1000);
    }

}

/**
 * Injects the minutes and seconds to the clock
 * @param {number} minutes 
 * @param {number} seconds 
 */
function injectDigits(minutes, seconds){

    MINUTES_HUNDREDS.innerHTML = `${Math.floor((minutes / 100) % 10)}`;
    MINUTES_TENS.innerHTML = `${Math.floor((minutes / 10) % 10)}`;
    MINUTES_UNITS.innerHTML = `${Math.floor((minutes / 1) % 10)}`;
    SECONDS_TENS.innerHTML = `${Math.floor((seconds / 10) % 10)}`;
    SECONDS_UNITS.innerHTML = `${Math.floor((seconds / 1) % 10)}`;


}


/**
 * Listens for the ENTER key on the input field
 */
INPUT.addEventListener("keydown", function (event) {
 if (event.key === "Enter") {  
   validate(event);
   document.getElementById("terminal-input-area").value = " ";
 }

});

/**
 * Validates the value of the input field
 * @param {*} event 
 */
function validate(event) {
    let inputText = event.target.value;

    if(inputText.match(/\s*4 \s*8 \s*15 \s*16 \s*23 \s*42\s*/)){
  
        restartTimer();
        ALARM.stop();
    }
  }

/**
 * Funtion that starts the timer
 */  
function startTimer(){

    let currentDate = new Date().getTime();
    
    let distance = newTimer.countdownDate - currentDate;

    let minutes = newTimer.getMinutes(distance) < 0 ? 0 : newTimer.getMinutes(distance);

    let seconds = newTimer.getSeconds(distance) < 0 ? 0 : newTimer.getSeconds(distance);

    if(minutes === 3){
        ALARM.play();
        INPUT?.removeAttribute("readonly");
    }
    
    if (minutes <= 0 && seconds <= 0) {
        clearInterval(timerInterval);
    }

    injectDigits(minutes, seconds);
    
}

/**
 * Function that restarts the timer
 */
function restartTimer(){

    clearInterval(timerInterval);

    MINUTES_HUNDREDS.innerHTML = "1";
    MINUTES_TENS.innerHTML = "0";
    MINUTES_UNITS.innerHTML = "8";
    SECONDS_TENS.innerHTML = "0";
    SECONDS_UNITS.innerHTML = "0";

    newTimer = new Timer(6481);

    timerInterval = setInterval(startTimer, 1000);

}

/**
 * New Date object 108 minutes in the future
 */
//let newTimer = new Timer(6481);
let newTimer = new Timer(300);

let timerInterval = setInterval(startTimer, 1000);

