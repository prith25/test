let questions = [];
let currentQuestionIndex = 0;
let timer = 60;
let timerInterval;
let userScore = 0;

// Elements
const startPage = document.getElementById("startPage");
const questionPage = document.getElementById("questionPage");
const resultPage = document.getElementById("resultPage");
const questionContainer = document.getElementById("questionContainer");
const timeLeft = document.getElementById("timeLeft");
const nextButton = document.getElementById("nextQuestion");
const scoreElement = document.getElementById("score");
const answersContainer = document.getElementById("answers");

document.getElementById("startTest").addEventListener("click", startTest);
nextButton.addEventListener("click", handleNextQuestion);
document.getElementById("viewQuestions").addEventListener("click", showAllQuestions);

async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        questions = await response.json();
    } catch (error) {
        alert("Failed to load questions. Please check the JSON file.");
    }
}

function startTest() {
    loadQuestions().then(() => {
        if (questions.length === 0) return;
        timer = parseInt(document.getElementById("timer").value);
        timeLeft.textContent = timer;
        showPage("questionPage");
        loadQuestion();
        startTimer();
    });
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionContainer.innerHTML = `
        <h2>${question.question}</h2>
        ${question.options
            .map(
                (option, index) =>
                    `<button class="option-btn" onclick="selectAnswer('${index}')">${option}</button>`
            )
            .join("")}
    `;
    nextButton.textContent = currentQuestionIndex === questions.length - 1 ? "Submit" : "Next Question";
    nextButton.classList.remove("hidden");
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft.textContent = timer;
    timerInterval = setInterval(() => {
        timeLeft.textContent -= 1;
        if (timeLeft.textContent <= 0) {
            clearInterval(timerInterval);
            handleNextQuestion();
        }
    }, 1000);
}

function selectAnswer(index) {
    questions[currentQuestionIndex].userAnswer = parseInt(index); // Save index
    document.querySelectorAll(".option-btn").forEach((btn, i) => {
        btn.classList.toggle("selected", i === index);
    });
}

function handleNextQuestion() {
    if (questions[currentQuestionIndex].userAnswer === undefined) {
        questions[currentQuestionIndex].userAnswer = "Not Answered";
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
    userScore = questions.filter(
        (q) =>
            q.userAnswer !== "Not Answered" &&
            q.options[q.userAnswer] === q.options[q.correctAnswer]
    ).length;

    scoreElement.textContent = `${userScore} / ${questions.length}`;
    showPage("resultPage");
}

function showAllQuestions() {
    answersContainer.innerHTML = questions
        .map(
            (q, index) =>
                `<div>
                    <h3>Q${index + 1}: ${q.question}</h3>
                    <p>Your Answer: ${
                        q.userAnswer !== "Not Answered"
                            ? q.options[q.userAnswer]
                            : "Not Answered"
                    }</p>
                    <p>Correct Answer: ${q.options[q.correctAnswer]}</p>
                </div>`
        )
        .join("");
    answersContainer.classList.remove("hidden");
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
        if (page.id === pageId) page.classList.add("active");
    });
}

document.addEventListener("DOMContentLoaded", () => showPage("startPage"));
