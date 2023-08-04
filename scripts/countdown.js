// #region Constants

/**
 * @constant
 * @type {HTMLImageElement}
 */
const GLYPH_1 = document.createElement("img");
/**
 * @constant
 * @type {HTMLImageElement}
 */
const GLYPH_2 = document.createElement("img");
/**
 * @constant
 * @type {HTMLImageElement}
 */
const GLYPH_3 = document.createElement("img");
/**
 * @constant
 * @type {HTMLImageElement}
 */
const GLYPH_4 = document.createElement("img");
/**
 * @constant
 * @type {HTMLImageElement}
 */
const GLYPH_5 = document.createElement("img");

GLYPH_1.src = "/assets/images/glyphs/g1.png";
GLYPH_2.src = "/assets/images/glyphs/g2.png";
GLYPH_3.src = "/assets/images/glyphs/g3.png";
GLYPH_4.src = "/assets/images/glyphs/g4.png";
GLYPH_5.src = "/assets/images/glyphs/g5.png";

const secondsTopHalf = document.querySelectorAll(".seconds-box .top");

const secondsBottomHalf = document.querySelectorAll(".seconds-box .bottom");

const secondsTopFlip = document.querySelectorAll(".seconds-box .flip-card .top-flip");

const secondsBottomFlip = document.querySelectorAll(".seconds-box .flip-card .bottom-flip");


/**
 * HTML element
 * @type {HTMLInputElement}
 */
const INPUT = getElementById("terminal-input-area", HTMLInputElement);

// #endregion Constants

// #region Domain Logic

/**
 * Class representing an Audio file
 * @extends Audio 
 */
class CustomAudio extends Audio{
    stop() {
        this.pause()
        this.currentTime = 0;
      }
  }

/**
 * @constant 
 */
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
 * @template {typeof HTMLElement} T
 * 
 * @param {string} id 
 * @param {T} ctor 
 * 
 * @returns {InstanceType<T>}
 */
function getElementById(id, ctor){

  const el = document.getElementById(id);

  if(!(el instanceof ctor) || el === null){
    throw new Error(
      `The element with id ${id} retrieved is not an instance of ${ctor.name}`
    );
  }
  //@ts-ignore
  return el;

}

/**
 * @template {typeof HTMLElement} T
 * 
 * @param {HTMLElement} object
 * @param {string} selector 
 * @param {T} ctor 
 * 
 * @returns {InstanceType<T>}
 */
function querySelector(object, selector, ctor){

  const sel = object.querySelector(selector);

  if(!(sel instanceof ctor) || sel === null){
    throw new Error(
      `The element ${selector} selected is not an instance of ${ctor.name}`
    );
  }
  //@ts-ignore
  return sel;
}

/**
 * @param {string} numericString
 * 
 * @returns {number}
 */
function parseInteger(numericString){

  if(Number.isNaN(Number(numericString)) || numericString === null){
    throw new Error(`${numericString} is not valid`);
  }

  return parseInt(numericString);

}

/**
 * Listens for the ENTER key on the input field
 */
INPUT.addEventListener("keydown", function (event) {
 if (event.key === "Enter") {  
   validate(event);
   getElementById("terminal-input-area", HTMLInputElement).value = " ";
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
   * 
   * @param {number} minutes 
   * @param {number} seconds 
   */
  function flipAllNumberCards(minutes, seconds) {

    flipNumbers(querySelector(document.documentElement, "[data-minutes-hundreds]", HTMLDivElement), Math.floor((minutes / 100) % 10));
    flipNumbers(querySelector(document.documentElement, "[data-minutes-tens]", HTMLDivElement), Math.floor((minutes / 10) % 10));
    flipNumbers(querySelector(document.documentElement, "[data-minutes-ones]", HTMLDivElement), Math.floor((minutes / 1) % 10));
    flipNumbers(querySelector(document.documentElement, "[data-seconds-tens]", HTMLDivElement), Math.floor((seconds / 10) % 10));
    flipNumbers(querySelector(document.documentElement, "[data-seconds-ones]", HTMLDivElement), Math.floor((seconds / 1) % 10));
  };

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} position 
 * @param {string} speed 
 */  
function changeAnimationClasses(element, position, speed){

    element.classList.add(`${position}-flip`, `${speed}-${position}-animation`);
}


/**
 * 
 * @param {HTMLElement} element 
 * @param {string | number | HTMLImageElement} content 
 */
function replaceElementContent(element, content){

  if (typeof content === "number" || typeof content === "string"){

      element.textContent = String(content);
  }else {
      element.appendChild(content);
  }
}

  /**
   * 
   * @param {HTMLDivElement} flipCard 
   * @param {number} newNumber 
   */
  function flipNumbers(flipCard, newNumber) {
    const topHalf = querySelector(flipCard, ".top", HTMLDivElement);
    const startNumber = parseInteger(String(topHalf.textContent));
    if (newNumber === startNumber) return
  
    const bottomHalf = querySelector(flipCard, ".bottom", HTMLDivElement);
    const topFlip = document.createElement("div");
    changeAnimationClasses(topFlip, "top", "slow");
    const bottomFlip = document.createElement("div");
    changeAnimationClasses(bottomFlip, "bottom", "slow");

    replaceElementContent(topHalf, startNumber);
    replaceElementContent(bottomHalf, startNumber);
    replaceElementContent(topFlip, startNumber);
    replaceElementContent(bottomFlip, newNumber);
  
    topFlip.addEventListener("animationstart", e => {
      replaceElementContent(topHalf, newNumber);
    })
    topFlip.addEventListener("animationend", e => {
      topFlip.remove()
    })
    bottomFlip.addEventListener("animationend", e => {
      replaceElementContent(bottomHalf, newNumber);
      bottomFlip.remove()
    })
    flipCard.append(topFlip, bottomFlip)
  }

  /**
   * @param {HTMLDivElement} flipCard
   * @param {HTMLImageElement} glyph
   * @param {number | null} timerInterval
   */
  function flipGlyphsRefactor(flipCard, glyph, timerInterval=null) {
    const topHalf = querySelector(flipCard, ".top", HTMLDivElement);
    const bottomHalf = querySelector(flipCard, ".bottom", HTMLDivElement);

    //querySelector(flipCard, ".top-flip", HTMLDivElement).remove();
    //querySelector(flipCard, ".bottom-flip", HTMLDivElement).remove();

    secondsTopHalf.forEach(e => e.style.backgroundColor = "#872b2f")

    secondsBottomHalf.forEach(e => e.style.backgroundColor = "#ad363c")
    
    replaceElementContent(topHalf, "");
    replaceElementContent(bottomHalf, "");

    const topFlip = document.createElement("div");
    changeAnimationClasses(topFlip, "top", "fast");
    const bottomFlip = document.createElement("div");
    changeAnimationClasses(bottomFlip, "bottom", "fast");

    if("secondsTens" in flipCard.dataset) {
      topFlip.style.backgroundColor = "#872b2f";
      bottomFlip.style.backgroundColor = "#ad363c";
    }

    if("secondsOnes" in flipCard.dataset) {
      topFlip.style.backgroundColor = "#872b2f";
      bottomFlip.style.backgroundColor = "#ad363c";
    }


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
    //replaceElementContent(topFlip, topFlipImg);
    //replaceElementContent(bottomFlip, bottomFlipImg);

    topFlip.addEventListener("animationstart", e => {
      replaceElementContent(topFlip, topFlipImg);
    })
    topFlip.addEventListener("animationend", e => {
      topFlip.remove()
    })
    bottomFlip.addEventListener("animationend", e => {
      replaceElementContent(bottomFlip, bottomFlipImg);
      bottomFlip.remove()
    })

    flipCard.append(topFlip, bottomFlip);
    
    // clearInterval(globalThis.glyphIntervalId)
  }

  /**
   * 
   * @param {number} initial 
   */
  function* generator(initial){

    let current = initial;

    while(current >= -1000){
      yield current;
      current--;
    }
  }
  const EVENT_KIND = Object.freeze({
    DECREASE_FLIP_CARD: "decrease-flip-card",
    FLIP_GLYPHS : "flip-glyphs"
    });

/**
 * @this {HTMLParagraphElement}
 * @param {HTMLImageElement} glyph 
 * @param {number} stopValue 
 * @param {CustomEvent} event 
 */
  function handleCardUpdate(glyph, stopValue, event) {
  
    const { counter } = event.detail;
    
    if (counter > 0) {
     flipNumbers(this, counter);
    }
  
    if(counter < 0 && counter > stopValue){
      flipGlyphsRefactor(this, glyph);
    }
  }

/**
 * @param {Generator<number>} generator
 * @param {string} eventKind
 * @param {number} timeout
 * @param {HTMLElement} element
 */
function createDispatcherCounterInterval(
  generator,
  eventKind,
  timeout,
  element,
  callback
) {
  const id = globalThis.crypto.randomUUID();

  globalThis[id] = setInterval(
    callback,
    timeout,
    generator,
    id,
    eventKind,
    element,
  );
}

/**
 * @param {Generator<number>} generator
 * @param {string} id
 * @param {string} eventKind
 * @param {HTMLElement} element
 */
function dispatchCounterInterval(generator, id, eventKind, element) {
  const result = generator.next();

  if (result.done) {
    clearInterval(globalThis[id]);
    delete globalThis[id];
  } else {
    const event = new CustomEvent(eventKind, {
      detail: {
        counter: result.value,

      },
    });

    element.dispatchEvent(event);
  }
}

/**
 * Function that starts the timer
 */  
function startTimer(){

    let currentDate = new Date().getTime();
    
    let timeLeft = newTimer.countdownDate - currentDate;

    let minutes = newTimer.getMinutes(timeLeft);

    let seconds = newTimer.getSeconds(timeLeft);

    if(minutes === 3){
        ALARM.play();
        INPUT.removeAttribute("readonly");
    }

    if(seconds >= 0){
      
      flipAllNumberCards(minutes, seconds);

    } else{
        clearInterval(timerInterval);

        createDispatcherCounterInterval(
          generator(9),
          EVENT_KIND.DECREASE_FLIP_CARD,
          130,
          querySelector(document.documentElement, "[data-seconds-ones]", HTMLDivElement),
          dispatchCounterInterval
        );

        createDispatcherCounterInterval(
          generator(9),
          EVENT_KIND.DECREASE_FLIP_CARD,
          100,
          querySelector(document.documentElement, "[data-seconds-tens]", HTMLDivElement),
          dispatchCounterInterval
        );

        createDispatcherCounterInterval(
          generator(9),
          EVENT_KIND.DECREASE_FLIP_CARD,
          100,
          querySelector(document.documentElement, "[data-minutes-ones]", HTMLDivElement),
          dispatchCounterInterval
        );

        createDispatcherCounterInterval(
          generator(9),
          EVENT_KIND.DECREASE_FLIP_CARD,
          130,
          querySelector(document.documentElement, "[data-minutes-tens]", HTMLDivElement),
          dispatchCounterInterval
        );

        createDispatcherCounterInterval(
          generator(9),
          EVENT_KIND.DECREASE_FLIP_CARD,
          100,
          querySelector(document.documentElement, "[data-minutes-hundreds]", HTMLDivElement),
          dispatchCounterInterval
        );

    }
        
}


/**
 * Function that restarts the timer
 */
function restartTimer(){

    clearInterval(timerInterval);

    INPUT.setAttribute("readonly", "true");

    newTimer = new Timer(6481);

    timerInterval = setInterval(startTimer, 1000);

}


let newTimer = new Timer(10);

let timerInterval = setInterval(startTimer, 1000);

querySelector(document.documentElement, "[data-minutes-hundreds]", HTMLDivElement).addEventListener(
  EVENT_KIND.DECREASE_FLIP_CARD,
  handleCardUpdate.bind(querySelector(document.documentElement, "[data-minutes-hundreds]", HTMLDivElement), GLYPH_1, -70)
);

querySelector(document.documentElement, "[data-minutes-tens]", HTMLDivElement).addEventListener(
  EVENT_KIND.DECREASE_FLIP_CARD,
  handleCardUpdate.bind(querySelector(document.documentElement, "[data-minutes-tens]", HTMLDivElement), GLYPH_2, -80)
);

querySelector(document.documentElement, "[data-minutes-ones]", HTMLDivElement).addEventListener(
  EVENT_KIND.DECREASE_FLIP_CARD,
  handleCardUpdate.bind(querySelector(document.documentElement, "[data-minutes-ones]", HTMLDivElement), GLYPH_3, -40)
);

querySelector(document.documentElement, "[data-seconds-tens]", HTMLDivElement).addEventListener(
  EVENT_KIND.DECREASE_FLIP_CARD,
  handleCardUpdate.bind(querySelector(document.documentElement, "[data-seconds-tens]", HTMLDivElement), GLYPH_4, -30)
);

querySelector(document.documentElement, "[data-seconds-ones]", HTMLDivElement).addEventListener(
  EVENT_KIND.DECREASE_FLIP_CARD,
  handleCardUpdate.bind(querySelector(document.documentElement, "[data-seconds-ones]", HTMLDivElement), GLYPH_5, -50)
);
