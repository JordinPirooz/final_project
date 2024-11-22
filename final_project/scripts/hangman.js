let allAnswers = [];
let selectedAnswer = "";
let selectedHint = "";
let guessedLetters = [];
let wrongGuesses = 0;
const maxWrongGuesses = 6;

function fetchAnswers() {
    const fetchFileURL = "json/answers.json";
    fetch(fetchFileURL)
        .then(function(response){
            if(response.ok){
                return response.json();
            }else{
                console.log("Network error: Fetch failed.")
            }
        })
        .then(function(data){
            allAnswers = data;
            initializeGame();
        })
}

function initializeGame() {
    const gameElements = document.getElementById("game-elements");
    document.getElementById("start-container").style.display = "none";
    gameElements.style.display = "block";
    fadeIn(gameElements);
    startGame();
}

function fadeIn(element) {
    let opacity = 0;
    let translateY = 20;

    function animate() {
        opacity += 0.01;
        translateY -= 0.2;

        element.style.opacity = opacity;
        element.style.transform = `translateY(${translateY}px)`;

        if (opacity < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.opacity = 1;
            element.style.transform = "translateY(0)";
        }
    }

    element.style.opacity = 0;
    element.style.transform = "translateY(20px)";
    requestAnimationFrame(animate);
}

function startGame() {
    const randomIndex = Math.floor(Math.random() * allAnswers.length);
    selectedAnswer = allAnswers[randomIndex].word;
    selectedHint = allAnswers[randomIndex].hint;
    guessedLetters = [];
    wrongGuesses = 0;

    document.getElementById("hint").textContent = selectedHint;
    document.getElementById("hangman-image").src = "images/hangman0.png";
    document.getElementById("result-container").style.display = "none";

    const answerContainer = document.getElementById("answer-container");
    answerContainer.innerHTML = "";
    for (let i = 0; i < selectedAnswer.length; i++) {
        const span = document.createElement("span");
        span.textContent = "_ ";
        span.className = "letter";
        answerContainer.appendChild(span);
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lettersContainer = document.getElementById('letters-container');
    lettersContainer.innerHTML = '';
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const button = document.createElement("button");
        button.textContent = letter;
        button.onclick = () => handleGuess(letter);
        lettersContainer.appendChild(button);
    }
}

function handleGuess(letter) {
    const buttons = document.querySelectorAll("#letters-container button");
    buttons.forEach((btn) => {
        if (btn.textContent === letter) {
            btn.disabled = true;
        }
    });

    if (selectedAnswer.includes(letter.toLowerCase())) {
        const answerContainer = document.getElementById("answer-container");
        [...selectedAnswer].forEach((char, index) => {
            if (char === letter.toLowerCase()) {
                answerContainer.children[index].textContent = letter;
            }
        });

        if (![...document.querySelectorAll(".letter")].some((span) => span.textContent === "_ ")) {
            endGame(true);
        }
    } else {
        wrongGuesses++;
        document.getElementById("hangman-image").src = `images/hangman${wrongGuesses}.png`;

        if (wrongGuesses === maxWrongGuesses) {
            endGame(false);
        }
    }
}

const Cat = {
    updateMood(mood) {
        const catImage = document.getElementById("cat-image");
        const catMessage = document.getElementById("cat-message");

        if (mood === "happy") {
            catImage.src = "images/mittens_happy.jpg";
            catImage.alt = "Happy Mittens";
            catMessage.textContent = "but Mittens is so happy you killed the mouse!";
        } else if (mood === "sad") {
            catImage.src = "images/mittens_sad.jpg";
            catImage.alt = "Sad Mittens";
            catMessage.textContent = "but Mittens is very sad that you let the mouse live!";
        }
    },
};

function endGame(isWin) {
    const resultContainer = document.getElementById("result-container");
    const resultMessage = document.getElementById("result-message");

    resultContainer.style.display = "block";

    if (isWin) {
        resultMessage.textContent = "Congratulations, You Won!";
        Cat.updateMood("sad");
    } else {
        resultMessage.textContent = `Game Over! The word was "${selectedAnswer}".`;
        Cat.updateMood("happy");
    }

    const buttons = document.querySelectorAll("#letters-container button");
    buttons.forEach((btn) => (btn.disabled = true));
}


function playAgain() {
    const gameElements = document.getElementById("game-elements");
    const resultContainer = document.getElementById("result-container");

    resultContainer.style.display = "none";
    fadeIn(gameElements);
    startGame();
}
