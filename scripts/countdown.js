// #region Constants

/**
 * HTML element
 * @type {HTMLElement | null}
 */


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
 * @param {number} timeLeft 
 * @returns {number}
 */
    getMinutes(timeLeft){
        return Math.floor((timeLeft / 60000));
    }

/**
 * Extracts the seconds from the milliseconds returned by Date and rounds them down
 * @param {number} timeLeft 
 * @returns {number}
 */
    getSeconds(timeLeft){
        return Math.floor((timeLeft % (1000 * 60)) / 1000);
    }

}

/**
 * Injects the minutes and seconds to the clock
 * @param {number} minutes 
 * @param {number} seconds 
 */
//function injectDigits(minutes, seconds){

    //MINUTES_HUNDREDS.innerHTML = `${Math.floor((minutes / 100) % 10)}`;
    //MINUTES_TENS.innerHTML = `${Math.floor((minutes / 10) % 10)}`;
    //MINUTES_UNITS.innerHTML = `${Math.floor((minutes / 1) % 10)}`;
    //SECONDS_TENS.innerHTML = `${Math.floor((seconds / 10) % 10)}`;
    //SECONDS_UNITS.innerHTML = `${Math.floor((seconds / 1) % 10)}`;


//}


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

  function flipAllCards(minutes, seconds) {

    flip(document.querySelector("[data-minutes-hundreds]"), Math.floor((minutes / 100) % 10));
    flip(document.querySelector("[data-minutes-tens]"), Math.floor((minutes / 10) % 10));
    flip(document.querySelector("[data-minutes-ones]"), Math.floor((minutes / 1) % 10));
    flip(document.querySelector("[data-seconds-tens]"), Math.floor((seconds / 10) % 10));
    flip(document.querySelector("[data-seconds-ones]"), Math.floor((seconds / 1) % 10));
  }
  
  function flip(flipCard, newNumber) {
    const topHalf = flipCard.querySelector(".top");
    const startNumber = parseInt(topHalf.textContent);
    if (newNumber === startNumber) return
  
    const bottomHalf = flipCard.querySelector(".bottom");
    const topFlip = document.createElement("div");
    topFlip.classList.add("top-flip");
    const bottomFlip = document.createElement("div");
    bottomFlip.classList.add("bottom-flip");
  
    topHalf.textContent = startNumber;
    bottomHalf.textContent = startNumber;
    topFlip.textContent = startNumber;
    bottomFlip.textContent = newNumber;
  
    topFlip.addEventListener("animationstart", e => {
      topHalf.textContent = newNumber
    })
    topFlip.addEventListener("animationend", e => {
      topFlip.remove()
    })
    bottomFlip.addEventListener("animationend", e => {
      bottomHalf.textContent = newNumber
      bottomFlip.remove()
    })
    flipCard.append(topFlip, bottomFlip)
  }

/**
 * Funtion that starts the timer
 */  
function startTimer(){

    let currentDate = new Date().getTime();
    
    let timeLeft = newTimer.countdownDate - currentDate;

    let minutes = newTimer.getMinutes(timeLeft) < 0 ? 0 : newTimer.getMinutes(timeLeft);

    let seconds = newTimer.getSeconds(timeLeft) < 0 ? 0 : newTimer.getSeconds(timeLeft);

    if(minutes === 3){
        ALARM.play();
        INPUT?.removeAttribute("readonly");
    }
    
    if (minutes <= 0 && seconds <= 0) {
        clearInterval(timerInterval);
    }

   // injectDigits(minutes, seconds);
    flipAllCards(minutes, seconds);
    
}

/**
 * Function that restarts the timer
 */
function restartTimer(){

    clearInterval(timerInterval);

    INPUT?.setAttribute("readonly", "true");

    newTimer = new Timer(6481);

    timerInterval = setInterval(startTimer, 1000);

}

/**
 * New Date object 108 minutes in the future
 */
let newTimer = new Timer(6481);
//let newTimer = new Timer(300);

let timerInterval = setInterval(startTimer, 1000);

