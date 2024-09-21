const questionsAndOptions = {
    "Which is the largest ocean?": [
        "Pacific Ocean",
        "Atlantic Ocean",
        "Antarctic Ocean",
        "Indian Ocean",
    ],
    "What is the synonym for fiend?": ["Enemy", "Friend", "Classmate", "Ninja"],
    "What is the capital of France?": ["Paris", "London", "Berlin", "Rome"],
    "Who wrote the play 'Romeo and Juliet'?": [
        "William Shakespeare",
        "Jane Austen",
        "Mark Twain",
        "Charles Dickens",
    ],
    "Which planet is known as the 'Red Planet'?": [
        "Mars",
        "Venus",
        "Jupiter",
        "Saturn",
    ],
    "Who painted the 'Mona Lisa'?": [
        "Leonardo da Vinci",
        "Vincent van Gogh",
        "Pablo Picasso",
        "Claude Monet",
    ],
    "What is the process of plants making their own food called?": [
        "Photosynthesis",
        "Respiration",
        "Transpiration",
        "Decomposition",
    ],
    "What gas do plants use for photosynthesis?": [
        "Carbon dioxide",
        "Oxygen",
        "Nitrogen",
        "Hydrogen",
    ],
    "Which gas do humans primarily breathe in?": [
        "Oxygen",
        "Carbon dioxide",
        "Nitrogen",
        "Hydrogen",
    ],
    "Which famous scientist developed the theory of relativity?": [
        "Albert Einstein",
        "Isaac Newton",
        "Galileo Galilei",
        "Marie Curie",
    ],
    "What is the largest mammal on Earth?": [
        "Blue whale",
        "African elephant",
        "Giraffe",
        "Polar bear",
    ],
    "What is the chemical symbol for gold?": ["Au", "Ag", "Fe", "Cu"],
    "What is the smallest prime number?": ["2", "1", "3", "5"],
    "What is the process of water turning into vapor called?": [
        "Evaporation",
        "Condensation",
        "Sublimation",
        "Freezing",
    ],
    "Who is the author of 'Pride and Prejudice'?": [
        "Jane Austen",
        "Emily Brontë",
        "George Orwell",
        "Mark Twain",
    ],
    "Who plays Batman in the Marvel Cinematic Universe?": [
        "None.",
        "Christian Bale",
        "Robert Pattinson",
        "Ben Affleck",
    ],
    "Which artist released the hit song 'Blinding Lights' in 2020?": [
        "The Weeknd",
        "Drake",
        "Post Malone",
        "Harry Styles",
    ],
    "Who directed the 1994 movie 'Pulp Fiction'?": [
        "Quentin Tarantino",
        "Steven Spielberg",
        "Martin Scorsese",
        "Christopher Nolan",
    ],
    "Which TV series is set in the fictional town of Hawkins, Indiana?": [
        "Stranger Things",
        "Breaking Bad",
        "The Walking Dead",
        "Game of Thrones",
    ],
    "Who starred as Jack in 'Titanic' (1997)?": [
        "Leonardo DiCaprio",
        "Brad Pitt",
        "Johnny Depp",
        "Matt Damon",
    ],
    "Ben affleck and Mattdamon won the oscar for Good will Hunting in what category? ":
        [
            "Original Screenplay",
            "Best actor ",
            "Best Supporting actor",
            "Best actor and Supporting actor ",
        ],

    "Who portrayed Joker in 'The dark knight' ?": [
        "Heath Ledger",
        "Heath Sledger",
        "Joaquin Pheonix",
        "Katy Perry",
    ],

    "Who created the 'Star Wars' franchise?": [
        "George Lucas",
        "Steven Spielberg",
        "J.J. Abrams",
        "James Cameron",
    ],
    "Which pop star is known for the hit song 'Shake It Off'?": [
        "Taylor Swift",
        "Ariana Grande",
        "Selena Gomez",
        "Dua Lipa",
    ],
    "Which is the Most successful souls game?": [
        "Elden ring",
        "Dark Souls 3",
        "Black Myth : Wukong",
        "God of War ragnarok",
    ],
    "What is the Most sold game ? ": [
        "Minecraft",
        "Cyberpunk",
        "Gta V",
        "PUBG",
    ],
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
            helperText.textContent = `Wrong Answer. ❌ Proceed to the next question.`;
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
    if (totalScore === 10 && questionCount === 10) {
        alert("You're a genius! 🎉 🎊 Take a Letter S as a prize!");
        disableCheckAnswer();
        disableNextQuestion();
        document.querySelector(".restart").disabled = true;
        fetch("/update-stage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ curStage: "3" }),
        })
            .then((res) => res.json())
            .then(console.log("Stage Updated"));
        const nextStageAnchor = document.createElement("a");
        nextStageAnchor.href = "/stage4";
        nextStageAnchor.style = "display: none;";
        document.body.appendChild(nextStageAnchor);
        nextStageAnchor.click();
    } else if (totalScore > 0 && totalScore < 10 && questionCount === 10) {
        alert("Restart to try again for a perfect score! ✅");
        disableCheckAnswer();
        disableNextQuestion();
        window.location.reload();
    } else if (totalScore === 0 && questionCount === 10) {
        alert("You should work on your general knowledge ❌. Restart to try again");
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
    scoreElement.textContent = `Your Total score is: ${totalScore}/10`;
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
