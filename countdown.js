// #region Constants

/**
 * @constant
 * @type {HTMLImageElement}
 */
const GLYPH_1 = document.createElement("img");


GLYPH_1.src = "/assets/images/glyphs/g1.png";


// #region Domain Logic


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
    
    
    replaceElementContent(topHalf, "");
    replaceElementContent(bottomHalf, "");

    const topFlip = document.createElement("div");
    changeAnimationClasses(topFlip, "top", "fast");
    const bottomFlip = document.createElement("div");
    changeAnimationClasses(bottomFlip, "bottom", "fast");

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

    while(current >= -200){
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
    element
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

  createDispatcherCounterInterval(
    generator(9),
    EVENT_KIND.DECREASE_FLIP_CARD,
    100,
    querySelector(document.documentElement, "[data-seconds-ones]", HTMLDivElement),
    dispatchCounterInterval
  );

        
}

querySelector(document.documentElement, "[data-seconds-ones]", HTMLDivElement).addEventListener(
  EVENT_KIND.DECREASE_FLIP_CARD,
  handleCardUpdate.bind(querySelector(document.documentElement, "[data-seconds-ones]", HTMLDivElement), GLYPH_1, -30)
);

startTimer();