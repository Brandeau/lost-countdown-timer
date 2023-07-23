// #region Constants

const GLYPH_1 = document.createElement("img");
const GLYPH_2 = document.createElement("img");
const GLYPH_3 = document.createElement("img");
const GLYPH_4 = document.createElement("img");
const GLYPH_5 = document.createElement("img");

GLYPH_1.src = "/assets/images/glyphs/g1.png";
GLYPH_2.src = "/assets/images/glyphs/g2.png";
GLYPH_3.src = "/assets/images/glyphs/g3.png";
GLYPH_4.src = "/assets/images/glyphs/g4.png";
GLYPH_5.src = "/assets/images/glyphs/g5.png";

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

  function flipAllNumberCards(minutes, seconds) {

    flipNumbers(document.querySelector("[data-minutes-hundreds]"), Math.floor((minutes / 100) % 10));
    flipNumbers(document.querySelector("[data-minutes-tens]"), Math.floor((minutes / 10) % 10));
    flipNumbers(document.querySelector("[data-minutes-ones]"), Math.floor((minutes / 1) % 10));
    flipNumbers(document.querySelector("[data-seconds-tens]"), Math.floor((seconds / 10) % 10));
    flipNumbers(document.querySelector("[data-seconds-ones]"), Math.floor((seconds / 1) % 10));
  };

  function flipAllGlyphCards() {

    flipGlyphsRefactor(document.querySelector("[data-minutes-hundreds]"), GLYPH_1);
    flipGlyphsRefactor(document.querySelector("[data-minutes-tens]"), GLYPH_2);
    flipGlyphsRefactor(document.querySelector("[data-minutes-ones]"), GLYPH_3);
    flipGlyphsRefactor(document.querySelector("[data-seconds-tens]"), GLYPH_4);
    flipGlyphsRefactor(document.querySelector("[data-seconds-ones]"), GLYPH_5);
  };

  function zeroNumbers(flipCard){
    const topHalf = flipCard.querySelector(".top");
    const bottomHalf = flipCard.querySelector(".bottom");

    topHalf.textContent = 0;
    bottomHalf.textContent = 0;

  }

  function zeroAllNumbers(){

    zeroNumbers(document.querySelector("[data-minutes-hundreds]"));
    zeroNumbers(document.querySelector("[data-minutes-tens]"));
    zeroNumbers(document.querySelector("[data-minutes-ones]"));
    zeroNumbers(document.querySelector("[data-seconds-tens]"));
    zeroNumbers(document.querySelector("[data-seconds-ones]"));
  }

  function changeAnimationSpeed(flipCard){

    console.log(flipCard);

      flipCard.style.animationDuration = "10ms";
  }

  
  function flipNumbers(flipCard, newNumber) {
    const topHalf = flipCard.querySelector(".top");
    const startNumber = parseInt(topHalf.textContent);
    if (newNumber === startNumber) return
  
    const bottomHalf = flipCard.querySelector(".bottom");
    const topFlip = document.createElement("div");
    topFlip.classList.add("top-flip", "slow-top-animation");
    const bottomFlip = document.createElement("div");
    bottomFlip.classList.add("bottom-flip", "slow-bottom-animation");

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

  function flipGlyphs(flipCard, glyph){

    const topHalf = flipCard.querySelector(".top");
    const bottomHalf = flipCard.querySelector(".bottom");
    const topFlip = document.createElement("div");
    topFlip.classList.add("top-flip");
    const bottomFlip = document.createElement("div");
    bottomFlip.classList.add("bottom-flip");

    topHalf.textContent = ""
    bottomHalf.textContent = ""
    // if(typeof topHalf.innerHTML === "string"){

    //   topHalf.replaceChildren();
    //   bottomHalf.replaceChildren();
    // }

    topHalf.append(glyph);
    bottomHalf.append(glyph);
    topFlip.append(glyph);
    bottomFlip.append(glyph);

    topFlip.addEventListener("animationstart", e => {
      topFlip.append(glyph);
      
  })
    topFlip.addEventListener("animationend", e => {
      topFlip.remove()
      bottomFlip.append(glyph);
    })
    bottomFlip.addEventListener("animationend", e => {
      bottomHalf.append(glyph);
      bottomFlip.remove()
    })
    flipCard.append(topFlip, bottomFlip);
  }

  /**
   * @param {HTMLDivElement} flipCard
   * @param {HTMLImageElement} glyph
   * @param {number | null} timerInterval
   */
  function flipGlyphsRefactor(flipCard, glyph, timerInterval=null) {
    const topHalf = flipCard.querySelector(".top");
    const bottomHalf = flipCard.querySelector(".bottom");

    flipCard.querySelector(".top-flip")?.remove()
    flipCard.querySelector(".bottom-flip")?.remove()
    
    topHalf.textContent = ""
    bottomHalf.textContent = ""

    const topFlip = document.createElement("div");
    topFlip.classList.add("top-flip", "fast-top-animation");
    const bottomFlip = document.createElement("div");
    bottomFlip.classList.add("bottom-flip", "fast-bottom-animation");

    const topHalfImg = document.createElement("img");
    topHalfImg.src = glyph.src;
    const bottomHalfImg = document.createElement("img");
    bottomHalfImg.src = glyph.src;
    const topFlipImg = document.createElement("img");
    topFlipImg.src = glyph.src;
    const bottomFlipImg = document.createElement("img");
    bottomFlipImg.src = glyph.src;
    
    topHalf.appendChild(topHalfImg);
    bottomHalf.appendChild(bottomHalfImg);
    topFlip.appendChild(topFlipImg);
    bottomFlip.appendChild(bottomFlipImg);

    flipCard.append(topFlip, bottomFlip);
    
    // clearInterval(globalThis.glyphIntervalId)
  }

/**
 * Funtion that starts the timer
 */  
function startTimer(){

    let currentDate = new Date().getTime();
    
    let timeLeft = newTimer.countdownDate - currentDate;

    //let minutes = newTimer.getMinutes(timeLeft) < 0 ? 0 : newTimer.getMinutes(timeLeft);
    let minutes = newTimer.getMinutes(timeLeft);

    //let seconds = newTimer.getSeconds(timeLeft) < 0 ? 0 : newTimer.getSeconds(timeLeft);
    let seconds = newTimer.getSeconds(timeLeft);

    if(minutes === 3){
        ALARM.play();
        INPUT?.removeAttribute("readonly");
    }

    if(seconds >= 0){
      
      flipAllNumberCards(minutes, seconds);

    } else{
        clearInterval(timerInterval);
        globalThis.glyphIntervalId = setInterval(flipAllGlyphCards, 10);
    }
        
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

let timerInterval = setInterval(startTimer, 1000);

