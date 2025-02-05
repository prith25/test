let questions = [];
let currentQuestionIndex = 0;
let userScore = 0;
let timer = null;

const timerDropdown = document.getElementById("timerDropdown");
const startButton = document.getElementById("startButton");
const questionContainer = document.getElementById("questionContainer");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextButton = document.getElementById("nextButton");
const resultContainer = document.getElementById("resultContainer");
const answersContainer = document.getElementById("answersContainer");

async function fetchQuestions() {
    try {
        const response = await fetch("questions.json");
        questions = await response.json();
    } catch (error) {
        alert("Failed to load questions. Please check the JSON file.");
    }
}

function startTest() {
    const selectedTime = parseInt(timerDropdown.value);
    if (isNaN(selectedTime)) {
        alert("Please select a timer value.");
        return;
    }
    startButton.style.display = "none";
    timerDropdown.style.display = "none";
    questionContainer.style.display = "block";
    loadQuestion();
    startTimer(selectedTime);
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    optionsContainer.innerHTML = "";
    question.options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.className = "option-button";
        button.onclick = () => {
            question.userAnswer = option; // Save the selected option as the user's answer
            highlightSelected(button);
        };
        optionsContainer.appendChild(button);
    });
}

function highlightSelected(selectedButton) {
    const buttons = optionsContainer.querySelectorAll(".option-button");
    buttons.forEach((btn) => btn.classList.remove("selected"));
    selectedButton.classList.add("selected");
}

function startTimer(duration) {
    let timeLeft = duration;
    updateTimerDisplay(timeLeft);
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        if (timeLeft === 0) {
            clearInterval(timer);
            handleNextQuestion();
        }
    }, 1000);
}

function updateTimerDisplay(timeLeft) {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `Time Left: ${timeLeft}s`;
}

function handleNextQuestion() {
    if (!questions[currentQuestionIndex].userAnswer) {
        questions[currentQuestionIndex].userAnswer = "Not Answered";
    }
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        resetTimer();
    } else {
        showResult();
    }
}

function resetTimer() {
    clearInterval(timer);
    const selectedTime = parseInt(timerDropdown.value);
    startTimer(selectedTime);
}

function showResult() {
    clearInterval(timer);
    questionContainer.style.display = "none";
    resultContainer.style.display = "block";

    userScore = questions.reduce((score, question) => {
        return score + (question.userAnswer === question.correctAnswer ? 1 : 0);
    }, 0);

    document.getElementById(
        "score"
    ).textContent = `Your Score: ${userScore} / ${questions.length}`;
}

function showAllQuestions() {
    answersContainer.innerHTML = questions
        .map((q, index) => {
            return `
                <div>
                    <h3>Q${index + 1}: ${q.question}</h3>
                    <p>Your Answer: ${
                        q.userAnswer ? q.userAnswer : "Not Answered"
                    }</p>
                    <p>Correct Answer: ${q.correctAnswer}</p>
                </div>`;
        })
        .join("");
    answersContainer.classList.remove("hidden");
}

startButton.addEventListener("click", startTest);
nextButton.addEventListener("click", handleNextQuestion);

fetchQuestions();
