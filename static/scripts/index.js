document.addEventListener("DOMContentLoaded", init);

// define important variables

const RANDOM_QUOTE_API_URL = "https://type.fit/api/quotes";

const quoteDisplay = document.querySelector("#quoteDisplay");
const quoteInput = document.querySelector("#quoteInput");
const authorDisplay = document.getElementById("authorDisplay");
const currentWpm = document.getElementById("currentWpm");
const timeLeft = document.getElementById("timeLeft");
const pastTimes = document.getElementById("pastTimes");
const displayPastWpms = document.querySelector(".pastWpms");
const countdownBox = document.querySelector(".countdown");
const textWpms = document.querySelector(".textWpms");
const displayPercentage = document.querySelector("#correct-percentage");

let pastWpms = [];
textWpms.hidden = true;
let numMatches = 0;

async function init() {
  quoteInput.disabled = true;
  countdownBox.hidden = false;

  let seconds = 6;
  timeLeft.hidden = false;

  window.scrollTo(0, document.body.scrollHeight);

  setIntervalX(
    () => {
      seconds--;
      timeLeft.innerHTML = seconds;

      if (seconds === 0) {
        timeLeft.hidden = true;
        countdownBox.hidden = true;
      }
    },
    1000,
    6
  );

  getNextWords();

  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));

  quoteInput.disabled = false;
  quoteInput.focus();
  startTimer();

  quoteInput.addEventListener("input", checkChars);
}

const setIntervalX = (callback, delay, repetitions) => {
  var x = 0;
  var intervalID = window.setInterval(function () {
    callback();

    if (++x === repetitions) {
      window.clearInterval(intervalID);
    }
  }, delay);
};

// function to fetch the sentence/quote
const getWords = async () => {
  let randIndex = Math.floor(Math.random() * 1600);
  return await fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data[randIndex]);
};

const getNextWords = async () => {
  const quote = await getWords();
  displaySentence(quote);
};

// function to display sentence/quote (dom)
const displaySentence = (sentence) => {
  sentence.text.split("").forEach((char) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerHTML = char;
    characterSpan.style.cssText =
      "-webkit-user-select: none;- khtml - user - select: none;-moz - user - select: none;-ms - user - select: none;-o - user - select: none;user - select: none;";
    quoteDisplay.appendChild(characterSpan);
  });

  // checks if there is an author
  const author = sentence.author ? `Author: ${sentence.author}` : "Anonymous";
  authorDisplay.innerHTML = author;
};

// keeps track of time passed
let startTime;
const startTimer = () => {
  startTime = new Date();
  setInterval(() => {
    currentWpm.innerHTML = calculateWpm(startTime);
  }, 50);
};

// checks if characters match
const checkChars = () => {
  const arrayQuote = quoteDisplay.querySelectorAll("span");
  const arrayValue = quoteInput.value.split("");

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    if (index === 0) {
      let classname =
        character === characterSpan.innerText ? "correct" : "incorrect";
      characterSpan.className = classname;
    } else {
      if (character === characterSpan.innerText) {
        let classname =
          arrayQuote[index - 1].className === "incorrect"
            ? "incorrect"
            : "correct";
        characterSpan.className = classname;
      } else {
        characterSpan.className = "incorrect";
      }
    }

    // makes sure not everything turns red
    if (character == null) {
      characterSpan.classList.remove("incorrect");
      characterSpan.classList.remove("correct");
    }

    // checks if all characters matches and resets game if so
    if (
      arrayQuote.length === arrayValue.length &&
      arrayQuote[arrayQuote.length - 1].className === "correct"
    ) {
      pastWpms.push(calculateWpm(startTime));

      newWpm(pastWpms);

      resetGame();
    }
  });
};

const newWpm = (pastWpms) => {
  if (pastWpms.length === 1) {
    const span = document.createElement("span");
    span.className = "averageWpm";
    span.innerHTML = pastWpms[pastWpms.length - 1];
    displayPastWpms.appendChild(span);
  } else {
    const averageWpm = document.querySelector(".averageWpm");
    let totalWpm = 0;
    let iterations = 0;
    pastWpms.forEach((pastWpm) => {
      totalWpm += parseFloat(pastWpm);
      iterations++;
    });

    let wpmAverage = (totalWpm / iterations).toFixed(2);
    averageWpm.innerHTML = wpmAverage;
  }
};

// calculate wpm every 50 milliseconds.
const calculateWpm = (startTime) => {
  const charsTyped = document.querySelectorAll(".correct").length;

  let passedTime = (new Date() - startTime) / 1000;
  let avgLength = 5;
  let multiple = 60 / passedTime;
  let total = multiple * charsTyped;
  let wpm = (total / avgLength).toFixed(2);

  displayWpmProgress(charsTyped);

  return wpm;
};

const displayWpmProgress = (charsTyped) => {
  const spansChars = quoteDisplay.querySelectorAll("span");
  const playerProgress = document.getElementById(`myBar`);
  const successPercentage = document.getElementById("myPercentage");

  let numOfChars = spansChars.length;
  let percentage = (charsTyped / numOfChars) * 100;
  let percentageSuccess = percentage.toFixed(2);

  playerProgress.style.width = `${percentage}%`;
  playerProgress.style.height = `${
    document.querySelector(".myProgress").clientHeight
  }px`;
  playerProgress.style.borderRadius = `12px`;
  successPercentage.innerHTML = `${percentageSuccess}%`;
};

const resetGame = () => {
  quoteDisplay.innerHTML = "";
  quoteInput.value = "";
  numMatches++;
  textWpms.innerHTML = `Your Average Past WPMs (${numMatches}):`;
  textWpms.hidden = false;
  init();
};
