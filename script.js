let questions = [];
let currentQuestionIndex = 0;
let timer = 60; // Default timer
let timerInterval;
let userScore = 0;

const configSection = document.getElementById("config");
const testSection = document.getElementById("test");
const resultSection = document.getElementById("result");
const questionContainer = document.getElementById("questionContainer");
const nextButton = document.getElementById("nextQuestion");
const timeLeft = document.getElementById("timeLeft");
const scoreElement = document.getElementById("score");
const answersContainer = document.getElementById("answers");

document.getElementById("startTest").addEventListener("click", startTest);
nextButton.addEventListener("click", handleNextQuestion);
document.getElementById("viewQuestions").addEventListener("click", showAllQuestions);

async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        if (!response.ok) throw new Error("Failed to load questions.");
        questions = await response.json();
    } catch (error) {
        console.error("Error loading questions:", error);
        alert("Failed to load questions. Please check the JSON file.");
    }
}

async function startTest() {
    await loadQuestions();
    if (questions.length === 0) return; // Stop if no questions are loaded
    timer = parseInt(document.getElementById("timer").value);
    timeLeft.textContent = timer;
    currentQuestionIndex = 0;
    userScore = 0;
    configSection.classList.add("hidden");
    testSection.classList.remove("hidden");
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionContainer.innerHTML = `
        <h2>${question.question}</h2>
        ${question.options
            .map(
                (option, index) =>
                    `<div>
                        <input type="radio" name="answer" id="option${index}" value="${option[0]}">
                        <label for="option${index}">${option}</label>
                    </div>`
            )
            .join("")}
    `;
    nextButton.textContent = currentQuestionIndex === questions.length - 1 ? "Submit" : "Next Question";
    nextButton.classList.remove("hidden");
}

function startTimer() {
    timeLeft.textContent = timer;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft.textContent -= 1;
        if (timeLeft.textContent <= 0) {
            clearInterval(timerInterval);
            handleNextQuestion();
        }
    }, 1000);
}

function handleNextQuestion() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        questions[currentQuestionIndex].userAnswer = selectedOption.value;
        if (selectedOption.value === questions[currentQuestionIndex].correctAnswer) {
            userScore++;
        }
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        startTimer();
    } else {
        clearInterval(timerInterval);
        showResult();
    }
}

function showResult() {
    testSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
    scoreElement.textContent = `${userScore} / ${questions.length}`;
}

function showAllQuestions() {
    answersContainer.innerHTML = questions
        .map(
            (q, index) =>
                `<div>
                    <h3>Q${index + 1}: ${q.question}</h3>
                    <p>Your Answer: ${q.userAnswer || "Not Answered"}</p>
                    <p>Correct Answer: ${q.correctAnswer}</p>
                </div>`
        )
        .join("");
    answersContainer.classList.remove("hidden");
}
