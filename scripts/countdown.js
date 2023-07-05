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

// #endregion Constants

// #region Domain Logic

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

        this.countdownDate = this.#date.setMinutes(this.#date.getMinutes() + timerLength);
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
        return Math.ceil((distance % (1000 * 60)) / 1000);
    }

}

function injectDigits(minutes, seconds){

    MINUTES_HUNDREDS.innerHTML = `${Math.floor((minutes / 100) % 10)}`;
    MINUTES_TENS.innerHTML = `${Math.floor((minutes / 10) % 10)}`;
    MINUTES_UNITS.innerHTML = `${Math.floor((minutes / 1) % 10)}`;
    SECONDS_TENS.innerHTML = `${Math.floor((seconds / 10) % 10)}`;
    SECONDS_UNITS.innerHTML = `${Math.floor((seconds / 1) % 10)}`;

}

let newTimer = new Timer(108);

let timerInterval = setInterval(function(){

    let currentDate = new Date().getTime();

    let distance = newTimer.countdownDate - currentDate;

    if (distance <= 0) {
        clearInterval(timerInterval);
    }

    injectDigits(newTimer.getMinutes(distance), newTimer.getSeconds(distance))

    console.log(`${Math.floor((newTimer.getMinutes(distance) / 100) % 10)} ${Math.floor((newTimer.getMinutes(distance) / 10) % 10)} ${Math.floor((newTimer.getMinutes(distance) / 1) % 10)} : ${Math.floor((newTimer.getSeconds(distance) / 10) % 10)} ${Math.floor((newTimer.getSeconds(distance) / 1) % 10)}`);

    
}, 1000)