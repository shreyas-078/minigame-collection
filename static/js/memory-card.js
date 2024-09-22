const gridContainer = document.querySelector(".grid-container");
const helperText = document.getElementById("helper-text");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let totalPairs;
let matchedPairs = 0;
let timerExpired = false;

function startTimer() {
  let timeRemaining = 100; // 1:40 in seconds
  let timerExpired = false;
  const timerElement = document.getElementById('timer');
  timerElement.textContent = "1:40";

  const countdown = setInterval(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timerElement.textContent = formattedTime;

    timeRemaining--;

    if (timeRemaining < 0) {
      clearInterval(countdown);
      timerExpired = true;
      timerElement.textContent = "0:00";
    }
  }, 1000); // Update every second
}

document.querySelector(".score").textContent = score;

document.addEventListener("DOMContentLoaded", () => {
  fetch("/fetch-cards")
    .then((res) => res.json())
    .then((data) => {
      cards = [...data];
      shuffleCards();
      generateCards();
    })
    .catch((error) => {
      console.error("Error fetching cards:", error);
    });
});

function shuffleCards() {
  let currentIndex = cards.length, randomIndex, temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  totalPairs = cards.length / 2;
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-token", card.token);  // Unique token for each card

    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src="${card.image}" />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  const firstToken = firstCard.dataset.token;
  const secondToken = secondCard.dataset.token;


  fetch("/check-match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selected_tokens: [firstToken, secondToken] }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.match) {
        disableCards();
      } else {
        unflipCards();
      }
    })
    .catch((error) => {
      console.error("Error checking match:", error);
    });
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matchedPairs++;

  checkForCompletion();

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function checkForCompletion() {
  if (matchedPairs === totalPairs && score <= 15) {
    fetch("/update-stage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curStage: "6" }),
    })
      .then((res) => res.json())
      .then(() => {
        console.log("Stage Updated");
      });
    helperText.textContent = "Congratulations! Among the Fruits, A Letter R was found. Proceeding to the next stage in 7 seconds!";
    helperText.style.color = "green";
    helperText.classList.remove("invisible");
    const nextStageAnchor = document.createElement("a");
    nextStageAnchor.href = "/stage7";
    nextStageAnchor.style = "display: none;";
    document.body.appendChild(nextStageAnchor);
    setTimeout(() => { nextStageAnchor.click() }, 7000);
  }

  if (matchedPairs === totalPairs && score > 15 || matchedPairs === totalPairs && timerExpired) {
    helperText.textContent = "You took too many moves and Fruits rotted. Please Try With A Fresh Batch of Fruits, arriving in 5 seconds.";
    helperText.style.color = "red";
    helperText.classList.remove("invisible");
    setTimeout(() => {
      restart();
    }, 7000);
  }
}

window.onload = startTimer;

function restart() {
  helperText.classList.add("invisible");
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
  startTimer();
}
