document.addEventListener("DOMContentLoaded", init)


// important elements

const submitButton = document.getElementById("submit_buitton")


const RANDOM_QUOTE_API_URL = "https://type.fit/api/quotes"
const quoteDisplay = document.querySelector("#quoteDisplay")
const quoteInput = document.querySelector("#quoteInput")
const authorDisplay = document.getElementById("authorDisplay")
const currentWpm = document.getElementById("currentWpm")
const startMatchBtn = document.getElementById("startMatch")
const timeLeft = document.getElementById("timeLeft")
const pastTimes = document.getElementById("pastTimes")
const displayPastWpms = document.querySelector(".pastWpms")
const progressBar = document.querySelector("#myBar")
let pastWpms = []


async function init() {

    let seconds = 6;
    quoteInput.disabled = true;
    timeLeft.hidden = false;
    getNextWords()

    setIntervalX(() => {
        seconds--;
        timeLeft.innerHTML = seconds;
        if (seconds === 0) {
            timeLeft.hidden = true;
        }
    }, 1000, 6)

    await new Promise(r => setTimeout(r, 6000));
    quoteInput.disabled = false;
    await new Promise(r => setTimeout(r, 50))
    quoteInput.focus()

    startTimer()

    setInterval(() => {
        calculateWpm
    }, 50);

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
    if (!sentence.author === null) {
        authorDisplay.innerHTML = `Author: ${sentence.author}`
    } else {
        authorDisplay.innerHTML = "Author: anonymous"
    }
    
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
                progressBar.innerHTML = ""
                
                init()
            }
        }
    })
}


let startTime;
function startTimer() {
    quoteInput.disabled = false;
    quoteInput.autofocus = true;
    startTime = new Date()
    setInterval(() => {
        currentWpm.innerHTML = calculateWpm(startTime)
    }, 49.5)
}


// calculate wpm every 50 milliseconds.
let percentage = 0
function calculateWpm(startTime) {
    let passedTime = (new Date() - startTime) / 1000
    let spansChars = quoteDisplay.querySelectorAll("span")
    // let numOfWords = 1
    // spansChars.forEach(char => {
    //     if (char.innerHTML === " ")
    //         numOfWords++;
    // })
    let numOfChars = spansChars.length
    // let avgLength = numOfChars / numOfWords
    let avgLength = 5.3
    let multiple = 60 / passedTime
    const charsTyped = document.querySelectorAll(".correct").length
    let total = multiple * charsTyped
    let wpm = total / avgLength
    wpm = wpm.toFixed(2)

    // display the thing
    let playerProgress = document.getElementById(`myBar`)
    percentage = (charsTyped / numOfChars) * 100
    playerProgress.style.width = `${percentage}%`

    // call function from here, socket function. We need to pass the info to the server for others to be able to see!

    return wpm
    // calculate wpm using special formula
}




