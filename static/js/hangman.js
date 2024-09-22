function drawHangman(livesRemaining) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffcc00';

  if (livesRemaining <= 9) {
    ctx.beginPath();
    ctx.moveTo(50, 180);
    ctx.lineTo(150, 180);
    ctx.stroke();
  }
  if (livesRemaining <= 8) {
    ctx.beginPath();
    ctx.moveTo(100, 180);
    ctx.lineTo(100, 20);
    ctx.stroke();
  }
  if (livesRemaining <= 7) {
    ctx.beginPath();
    ctx.moveTo(100, 20);
    ctx.lineTo(150, 20);
    ctx.lineTo(150, 40);
    ctx.stroke();
  }
  if (livesRemaining <= 6) {
    ctx.beginPath();
    ctx.arc(150, 50, 20, 0, Math.PI * 2, true);
    ctx.stroke();
  }
  if (livesRemaining <= 5) {
    ctx.beginPath();
    ctx.moveTo(150, 70);
    ctx.lineTo(150, 130);
    ctx.stroke();
  }
  if (livesRemaining <= 4) {
    ctx.beginPath();
    ctx.moveTo(150, 90);
    ctx.lineTo(120, 70);
    ctx.stroke();
  }
  if (livesRemaining <= 3) {
    ctx.beginPath();
    ctx.moveTo(150, 90);
    ctx.lineTo(180, 70);
    ctx.stroke();
  }
  if (livesRemaining <= 2) {
    ctx.beginPath();
    ctx.moveTo(150, 130);
    ctx.lineTo(120, 170);
    ctx.stroke();
  }
  if (livesRemaining <= 1) {
    ctx.beginPath();
    ctx.moveTo(150, 130);
    ctx.lineTo(180, 170);
    ctx.stroke();
  }
}

const categories = {
  BIT: [
    { phrase: "kateel", hint: "Egg Puffs" },
    { phrase: "mass bunk", hint: "1 Credit Subjects" },
    { phrase: "five", hint: "Number of Entrances to College " },
    { phrase: "quadrangle", hint: "Center of Attraction" },
    { phrase: "manthan", hint: "Once a year" },
    { phrase: "Kuvempu kalakshetra", hint: "Our Colosseum" },
    { phrase: "nikhil kamath", hint: "Zerodha" },
    {
      phrase: "Shankar Nag",
      hint: "Autoraja, poster under National college metro",
    },
    { phrase: "Rajya Vokkaligara Sangha", hint: "Organization that established BIT" },
  ],
  Films: [
    { phrase: "mungaru male", hint: "Water, Rabbit, Watch" },
    { phrase: "kirik party", hint: "Kannada Engineering Classic" },
    { phrase: "shutter island", hint: "DiCaprio's Dream" },
    { phrase: "finding nemo", hint: "Orange Fish" },
    { phrase: "yeh jawani hai deewani", hint: "Manali Trip Life Change" },
    { phrase: "chichore", hint: "Hindi Engineering Classic" },
    { phrase: "gaalipata", hint: "Kite" },
    { phrase: "mission impossible", hint: "Train parachute stunt" },
    { phrase: "terminator", hint: "Lava thumbs up" },
    { phrase: "predator", hint: "Get to the choppa" },
    { phrase: "justice league", hint: "DC get-together" },
    { phrase: "doctor strange", hint: "Master of mystic arts" },
    { phrase: "kashmir files", hint: "Pandits excommunication" },
    { phrase: "dangal", hint: "Wrestling and daughters" },
    { phrase: "3-idiots", hint: "All is well" },
    { phrase: "the-godfather", hint: "Italian crime family" },
    { phrase: "inception", hint: "Dream within a dream" },
    { phrase: "avatar", hint: "Blue aliens and Pandora" },
    { phrase: "tumbbad", hint: "Treasure and mythology" },
    { phrase: "padmaavat", hint: "Queen and valor" },
    { phrase: "zindagi-na-milegi-dobara", hint: "Road trip in Spain" },
    { phrase: "slumdog-millionaire", hint: "Game show and destiny" },
    { phrase: "the-dark-knight", hint: "Hero vs. Joker" },
  ],
  Cities: [
    { phrase: "kolkata", hint: "Won IPL in 2014" },
    { phrase: "mumbai", hint: "Home to Bollywood" },
    { phrase: "hyderabad", hint: "Charminar and biryani" },
    { phrase: "bengaluru", hint: "3rd Most populated in India" },
    { phrase: "mysore", hint: "Heritage City" },
    { phrase: "delhi", hint: "Pollution City" },
    { phrase: "chikmaglur", hint: "Land of Coffee" },
    { phrase: "mangalore", hint: "Famous for beaches and seafood" },
    { phrase: "coorg", hint: "Scenic hills,Switzerland of India" },
    { phrase: "davangere", hint: "famous for benne dose " },
    { phrase: "shimoga", hint: "Gateway to Jog Falls" },
    { phrase: "kolar", hint: "Gold mines and historical significance" },
    { phrase: "udupi", hint: "Famous for Krishna temple and matt" },
    { phrase: "tumkur", hint: "Educational hub with several institutions" },
    { phrase: "chitradurga", hint: "Famous for its fort and history" },
  ],
};

let currentCategory = '';
let currentPhrase = '';
let currentHint = '';
let lives = 10;
let guessedLetters = [];
let correctLetters = [];
let consecutiveWins = 0;
let usedCategories = [];
let correctPhrasesCount = 0;

const phraseDisplay = document.getElementById('word-container');
const livesDisplay = document.getElementById('lives-count');
const lettersGuessedDisplay = document.getElementById('letters-guessed');
const keyboardContainer = document.getElementById('keyboard-container');
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
const categoryDisplay = document.getElementById('current-category');
const correctPhrasesCountDisplay = document.getElementById('correct-phrases-count');

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

function startGame() {
  lives = 10;
  guessedLetters = [];
  correctLetters = [];
  usedCategories = [];
  document.getElementById('hint-message').style.display = 'none';
  selectNextCategory();
  updateLivesDisplay();
  updateCorrectPhrasesCountDisplay();
}

function selectNextCategory() {
  const categoriesKeys = Object.keys(categories);
  if (usedCategories.length === categoriesKeys.length) {
    alert("All categories have been used. Restarting game.");
    usedCategories = [];
  }

  let randomCategory;
  do {
    randomCategory = categoriesKeys[Math.floor(Math.random() * categoriesKeys.length)];
  } while (usedCategories.includes(randomCategory));

  const phraseObj = getRandomPhrase(randomCategory);
  currentCategory = randomCategory;
  currentPhrase = phraseObj.phrase;
  currentHint = phraseObj.hint;

  guessedLetters = [];
  correctLetters = [];
  usedCategories.push(currentCategory);

  updateCategoryDisplay();
  updatePhraseDisplay();
  createKeyboard();
}

function getRandomPhrase(category) {
  const phrases = categories[category];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

function updateCategoryDisplay() {
  categoryDisplay.textContent = `Current Category: ${currentCategory}`;
}

function updateCorrectPhrasesCountDisplay() {
  correctPhrasesCountDisplay.textContent = `Correct Phrases: ${correctPhrasesCount}`;
}

function updatePhraseDisplay() {
  phraseDisplay.innerHTML = `Guess the phrase: <span id="current-phrase">${displayPhrase(currentPhrase, correctLetters)}</span>`;
}

function displayPhrase(phrase, correctLettersArray) {
  return phrase.split('').map((letter) => {
    if (letter === ' ') {
      return '&nbsp;';
    }
    return (correctLettersArray.includes(letter.toLowerCase()) ? letter : '_') + ' ';
  }).join('');
}

function createKeyboard() {
  keyboardContainer.innerHTML = '';
  alphabet.forEach(letter => {
    const button = document.createElement('button');
    button.textContent = letter;
    button.classList.add('keyboard-button');
    button.disabled = false;
    button.addEventListener('click', () => {
      guessLetter(letter);
      button.disabled = true;
    });
    keyboardContainer.appendChild(button);
  });
}

function guessLetter(letter) {
  if (guessedLetters.includes(letter)) {
    alert("You've already guessed that letter.");
    return;
  }

  guessedLetters.push(letter);
  if (currentPhrase.toLowerCase().includes(letter)) {
    correctLetters.push(letter);
    if (checkWin()) {
      ++correctPhrasesCount;
      alert("You've guessed the phrase!");
      updateCorrectPhrasesCountDisplay();

      // Check for consecutive wins
      consecutiveWins++;
      if (consecutiveWins === 3) {
        document.querySelector("#win-message").style.display = "block";
        setTimeout(() => {
          fetch("/update-stage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ curStage: "4" }),
          })
            .then((res) => res.json())
            .then(console.log("Stage Updated"));
          const nextStageAnchor = document.createElement("a");
          nextStageAnchor.href = "/stage5";
          nextStageAnchor.style = "display: none;";
          document.body.appendChild(nextStageAnchor);
          nextStageAnchor.click();
          resetConsecutiveWins();
        }, 7000);
      } else {
        startGame();
      }
    }
  } else {
    lives--;
    if (lives === 0) {
      alert(`Game Over! The phrase was "${currentPhrase}".`);
      resetConsecutiveWins(); // Reset on game over
      correctPhrasesCount = 0;
      startGame();
    }
  }
  updatePhraseDisplay();
  updateLivesDisplay();
}

function resetConsecutiveWins() {
  consecutiveWins = 0;
}

function updateLivesDisplay() {
  livesDisplay.textContent = lives;
  drawHangman(lives);
}


function checkWin() {
  return currentPhrase.split('').every(letter => {
    return letter === ' ' || correctLetters.includes(letter.toLowerCase());
  });
}

function showHint() {
  if (currentHint) {
    document.getElementById('hint-message').textContent = `Hint: ${currentHint}`;
    document.getElementById('hint-message').style.display = 'block';
  } else {
    alert("No hint available for this phrase.");
  }
}

function resetGame() {
  consecutiveWins = 0;
  lives = 10;
  guessedLetters = [];
  correctLetters = [];
  usedCategories = [];
  correctPhrasesCount = 0;
  updateCorrectPhrasesCountDisplay();
  document.getElementById('hint-message').style.display = 'none';
  startGame();
}

document.getElementById('hint-button').addEventListener('click', showHint);
document.getElementById('reset-button').addEventListener('click', resetGame);

window.onload = startGame;
