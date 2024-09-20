let score = 0;
let topics = [];
let currentTopic, nextTopic;

fetch("/fetch-images")
    .then((res) => res.json())
    .then((data) => {
        topics = [...data];
        initializeGame();
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });

const currentTopicNameElement = document.getElementById('currentTopicName');
const currentTopicSearchesElement = document.getElementById('currentTopicSearches');
const currentTopicImageElement = document.getElementById('currentTopicImage');
const nextTopicNameElement = document.getElementById('nextTopicName');
const nextTopicImageElement = document.getElementById('nextTopicImage');
const resultMessageElement = document.getElementById('resultMessage');
const scoreElement = document.getElementById('score');
const higherButton = document.getElementById('higherButton');
const lowerButton = document.getElementById('lowerButton');

function initializeGame() {
    currentTopic = getRandomTopic();
    nextTopic = getRandomUniqueTopic(currentTopic);

    higherButton.addEventListener('click', () => guess(true));
    lowerButton.addEventListener('click', () => guess(false));

    updateUI();
}

function getRandomTopic() {
    const randomIndex = Math.floor(Math.random() * topics.length);
    return topics[randomIndex];
}

function getRandomUniqueTopic(excludeTopic) {
    let topic;
    do {
        topic = getRandomTopic();
    } while (topic.name === excludeTopic.name);
    return topic;
}

function guess(isHigher) {
    if (
        (isHigher && nextTopic.searches > currentTopic.searches) ||
        (!isHigher && nextTopic.searches < currentTopic.searches)
    ) {
        score++;
        resultMessageElement.textContent = 'Correct! Keep going!';
        resultMessageElement.classList.remove('error');
        if (score === 5) {
            setTimeout(() => {
                fetch("/update-stage", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ curStage: "5" }),
                })
                    .then((res) => res.json())
                    .then(console.log("Stage Updated"));
                alert("You Win! Take this Most searched letter I as a present. Leaving to the next stage in 5 seconds.")
                const nextStageAnchor = document.createElement("a");
                nextStageAnchor.href = "/stage6";
                nextStageAnchor.style = "display: none;";
                document.body.appendChild(nextStageAnchor);
                nextStageAnchor.click();
            }, 5000);
        }
    } else {
        resultMessageElement.textContent = `Wrong! ${nextTopic.name} has ${nextTopic.searches} searches. Game over!`;
        resultMessageElement.classList.add('error');
        score = 0;
    }

    currentTopic = nextTopic;
    nextTopic = getRandomUniqueTopic(currentTopic);

    updateUI();
}

function updateUI() {
    if (currentTopic && nextTopic) {
        currentTopicNameElement.textContent = currentTopic.name;
        currentTopicSearchesElement.textContent = `Searches: ${currentTopic.searches}`;
        currentTopicImageElement.src = currentTopic.image;

        nextTopicNameElement.textContent = nextTopic.name;
        nextTopicImageElement.src = nextTopic.image;

        scoreElement.textContent = `Score: ${score}`;
    }
}
