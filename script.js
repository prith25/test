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
                    `<button class="option-btn" onclick="selectAnswer('${option}', '${index}')">${option}</button>`
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

function selectAnswer(optionText, index) {
    questions[currentQuestionIndex].userAnswer = optionText;
    document.querySelectorAll(".option-btn").forEach((btn, i) => {
        btn.style.background = i == index ? "#16a085" : "#1abc9c";
    });
}

function handleNextQuestion() {
    const question = questions[currentQuestionIndex];
    if (!question.userAnswer) question.userAnswer = "Not Answered";

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
    const correctCount = questions.filter((q) => q.userAnswer === q.options[q.correctAnswer]).length;
    scoreElement.textContent = `${correctCount} / ${questions.length}`;
}

function showAllQuestions() {
    answersContainer.innerHTML = questions
        .map(
            (q, index) =>
                `<div>
                    <h3>Q${index + 1}: ${q.question}</h3>
                    <p>Your Answer: ${q.userAnswer || "Not Answered"}</p>
                    <p>Correct Answer: ${q.options[q.correctAnswer]}</p>
                </div>`
        )
        .join("");
    answersContainer.classList.remove("hidden");
}
