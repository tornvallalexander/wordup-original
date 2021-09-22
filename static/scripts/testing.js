document.addEventListener("DOMContentLoaded", init)

// define important variables

const RANDOM_QUOTE_API_URL = "https://type.fit/api/quotes"
const quoteDisplay = document.querySelector("#quoteDisplay")
const quoteInput = document.querySelector("#quoteInput")
const authorDisplay = document.getElementById("authorDisplay")
const currentWpm = document.getElementById("currentWpm")
const startMatchBtn = document.getElementById("startMatch")
const timeLeft = document.getElementById("timeLeft")
const pastTimes = document.getElementById("pastTimes")
const displayPastWpms = document.querySelector(".pastWpms")
let pastWpms = []


async function init() {
    // we need to start off by getting the words, then displaying the words
    quoteInput.disabled = true;
    timeLeft.hidden = false;
    let seconds = 6;
    setIntervalX(() => {
        seconds--;
        timeLeft.innerHTML = seconds;
        if (seconds === 0) {
            timeLeft.hidden = true;
        }
    }, 1000, 6)
    
    getNextWords()
    // quoteInput.disabled = true;
    await new Promise(r => setTimeout(r, 6000));
    quoteInput.disabled = false;
    await new Promise(r => setTimeout(r, 50))
    quoteInput.focus()
    // clearInterval(countDown)
    startTimer()

    // we then need something like eventlistener to help function fire on input
    // start time.
    quoteInput.addEventListener("input", checkChars)
}


function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

        callback();

        if (++x === repetitions) {
            window.clearInterval(intervalID);
        }
    }, delay);
}


function countDown() {
    if (seconds === 0) {
        timeLeft.hidden = true;
    } else {
        seconds--;
        timeLeft.innerHTML = seconds;
        timeLeft.hidden = false;
    }
}


// function to fetch the sentence/quote (video)
function getWords() {
    let randIndex = Math.floor(Math.random() * 1600);
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data[randIndex])
}


async function getNextWords() {
    const quote = await getWords()
    // console.log(quote.text, quote.author)
    displaySentence(quote)
    // using async and await to get call api directly and get next words without having to wait
}


// function to display sentence/quote (dom)
function displaySentence(sentence) {
    sentence.text.split("").forEach(char => {
        const characterSpan = document.createElement("span")
        characterSpan.innerHTML = char;
        quoteDisplay.appendChild(characterSpan)
    });
    authorDisplay.innerHTML = `Author: ${sentence.author}`
}

// check if characters match
function checkChars() {
    const arrayQuote = quoteDisplay.querySelectorAll("span")
    const arrayValue = quoteInput.value.split("")

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]

        if (index === 0) {
            if (character === characterSpan.innerText) {
                characterSpan.className = "correct"
            } else {
                characterSpan.className = "incorrect"
            }
        } else {
            if (character === characterSpan.innerText) {
                if (arrayQuote[index - 1].className === "incorrect") {
                    characterSpan.className = "incorrect"
                } else {
                    characterSpan.className = "correct"
                }
            } else {
                characterSpan.className = "incorrect"
            }
        }
        if (character == null) {
            characterSpan.classList.remove("incorrect")
            characterSpan.classList.remove("correct")
        }
        if (arrayQuote.length === arrayValue.length) {

            if (arrayQuote[arrayQuote.length - 1].className === "correct") {
                pastWpms.push(calculateWpm(startTime))
                const span = document.createElement("span")
                span.innerHTML = pastWpms[pastWpms.length - 1]
                displayPastWpms.appendChild(span)
                quoteDisplay.innerHTML = ""
                quoteInput.value = ""
                init()
            }
        }
    })
}


// count how much time have passed
let startTime;
function startTimer() {
    console.log("timer started")
    quoteInput.disabled = false;
    quoteInput.autofocus = true;
    startTime = new Date()
    setInterval(() => {
        currentWpm.innerHTML = calculateWpm(startTime)
    }, 49.5)
}


// calculate wpm every 50 milliseconds.
function calculateWpm(startTime) {
    let passedTime = (new Date() - startTime) / 1000
    let spansChars = quoteDisplay.querySelectorAll("span")
    let numOfWords = 1
    spansChars.forEach(char => {
        if (char.innerHTML === " ")
            numOfWords++;
    })
    let numOfChars = spansChars.length
    let avgLength = numOfChars / numOfWords
    let multiple = 60 / passedTime
    const charsTyped = document.querySelectorAll(".correct").length
    let total = multiple * charsTyped
    let wpm = total / avgLength
    wpm = wpm.toFixed(2)
    return wpm
    // calculate wpm using special formula
}
