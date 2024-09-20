const questionsAndOptions = {
  "Monsoon rain..What is the dance of your drops": [
    "Mungaru Male",
    "Ranna",
    "Maanikya",
    "Hebbuli",
  ],
  "Come along with me, O Companion Just like a hero who becomes part of a story O, Come along smoothly O soft- spoken one In love, this entire world is like a bar": ["Jotegaara ", "KGF", "Kantara", "Lucia"],
  "Swear on Goddess Chamundi, I am always yours In all my re-births I would be born here itself I would always love only you lion": ["Aaptharakshaka", "Sati Sulochana", "Raajakumara", "Ulidavaru Kandanthe"],
  "I see God in you, my beloved, and I bow my head in prayer, wondering what I can do": [
    "Rab Ne Bana Di Jodi",
    "Black",
    "Dil Chahta Hai",
    "Swades",
  ],
  "You are the only one, now my life is only about you.": [
    "Aashiqui 2",
    "3 Idiots",
    "Gangs of Wasseypur",
    "Bhaag Milkha Bhaag",
  ],
  "How can anyone not fall in love with you or stop thinking about you?": [
    "Yeh Jawaani Hai Deewani",
    "Dangal",
    "Bhaag Milkha Bhaag",
    "Ae Dil Hai Mushkil",
  ],
  "Near, far, wherever you are, I believe that the heart does go on, and we'll stay forever this way.": [
    "Titanic",
    "Forrest Gump",
    "The Godfather",
    "The Wolf of Wall Street",
  ],
  "I'm off the deep end, watch as I dive in, I'll never meet the ground. In the shallow, shallow, in the sha-la-low.": [
    "A Star Is Born",
    "Scarface",
    " The Bucket List",
    "The Terminal",
  ],
  "The cold never bothered me anyway. Let it go, let it go, can't hold it back anymore.": [
    "Frozen",
    "The Bridges of Madison County",
    " Driving Miss Daisy",
    "Catch Me If You Can",
  ]

};

const checkAnswerButton = document.getElementById("check-answer");
const nextQuestionButton = document.getElementById("next-question");
const question = document.querySelector(".question");
let totalScore = 0;
let questionCount = 0;

generateRandomQuestion();
disableNextQuestion();

function checkAnswer() {
  let helperText = document.querySelector(".helper-text");
  const currentQuestion = document.querySelector(".question").textContent;
  let selectedOption = "";
  const radioButtons = document.querySelectorAll(".radio");
  let checkedRadio = 0;
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      checkedRadio = radioButton;
    }
  }
  if (checkedRadio) {
    removeHelperText();
    selectedOption = checkedRadio.nextElementSibling.textContent;
    if (selectedOption === questionsAndOptions[currentQuestion][0]) {
      helperText.textContent =
        "Correct Answer! ✅ Proceed to the next question!";
      showHelperText();
      ++totalScore;
      updateScore();
      disableCheckAnswer();
      enableNextQuestion();
      ++questionCount;
      delete questionsAndOptions[currentQuestion];
    } else {
      helperText.textContent = `Wrong Answer. ❌ Proceed to the next question. Correct answer was "I Guess we'll never know" - Kanye West.`;
      showHelperText();
      disableCheckAnswer();
      enableNextQuestion();
      ++questionCount;
      delete questionsAndOptions[currentQuestion];
    }
  } else {
    showHelperText();
    disableNextQuestion();
  }
}

function showHelperText() {
  const helperText = document.querySelector(".helper-text");
  helperText.classList.remove("invisible");
  helperText.classList.add("visible");
}

function removeHelperText() {
  const helperText = document.querySelector(".helper-text");
  helperText.classList.add("invisible");
  helperText.classList.remove("visible");
}

function generateRandomQuestion() {
  enableCheckAnswer();
  if (totalScore === 3 && questionCount === 3) {
    alert("You're a genius! 🎉 🎊 Good luck on your next stage!. Celebrate with this random letter D.");
    disableCheckAnswer();
    disableNextQuestion();
    document.querySelector(".restart").disabled = true;
    fetch("/update-stage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curStage: "7" }),
    })
      .then((res) => res.json())
      .then(console.log("Stage Updated"));
    const nextStageAnchor = document.createElement("a");
    nextStageAnchor.href = "/stage8";
    nextStageAnchor.style = "display: none;";
    document.body.appendChild(nextStageAnchor);
    nextStageAnchor.click();
  } else if (totalScore > 0 && totalScore < 3 && questionCount === 3) {
    alert("Restart to try again for a perfect score! ✅");
    disableCheckAnswer();
    disableNextQuestion();
    window.location.reload();
  } else if (totalScore === 0 && questionCount === 3) {
    alert("You should work on your music knowledge ❌. Restart to try again");
    disableCheckAnswer();
    disableNextQuestion();
    window.location.reload();
  }

  disableNextQuestion();
  removeHelperText();
  let onlyQuestions = Object.keys(questionsAndOptions);
  const randomIndex = Math.floor(Math.random() * onlyQuestions.length);
  const randomQuestion = onlyQuestions[randomIndex];

  question.textContent = randomQuestion;

  options = document.querySelectorAll(".label");
  const opIndices = shuffleArray([0, 1, 3, 2]);
  for (let i = 0; i < 4; i++) {
    options[i].textContent = questionsAndOptions[randomQuestion][opIndices[i]];
  }
}

function updateScore() {
  const scoreElement = document.querySelector(".total-score");
  scoreElement.textContent = `Your Total score is: ${totalScore}/3`;
}

function disableCheckAnswer() {
  checkAnswerButton.disabled = true;
}

function enableCheckAnswer() {
  checkAnswerButton.disabled = false;
}

function disableNextQuestion() {
  nextQuestionButton.disabled = true;
}

function enableNextQuestion() {
  nextQuestionButton.disabled = false;
}

//Fisher-Yates Shuffler
function shuffleArray(param) {
  const shuffled = param.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

checkAnswerButton.addEventListener("click", checkAnswer);
nextQuestionButton.addEventListener("click", generateRandomQuestion);
