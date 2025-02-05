import React, { useState } from "react";
import Timer from "@/components/Timer";
import Question from "@/components/Question";
import Results from "@/components/Results";
import questionsData from "@/data/questions.json";

const Index = () => {
  const [questions] = useState(questionsData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questionsData.length).fill(null)
  );
  const [timerDuration, setTimerDuration] = useState(60);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);

  const handleStartTest = () => {
    if (questions.length === 0) {
      console.error("No questions available");
      return;
    }
    setIsTestStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsTestComplete(true);
    }
  };

  const handleTimeUp = () => {
    handleNextQuestion();
  };

  if (!isTestStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">MCQ Test</h1>
            <p className="text-gray-600">Configure your test settings</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Time per question:
              </label>
              <select
                value={timerDuration}
                onChange={(e) => setTimerDuration(Number(e.target.value))}
                className="ml-4 p-2 border rounded-md"
              >
                <option value={60}>60 seconds</option>
                <option value={100}>100 seconds</option>
                <option value={120}>120 seconds</option>
              </select>
            </div>

            <button
              onClick={handleStartTest}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isTestComplete) {
    return (
      <Results
        score={answers.reduce(
          (score, answer, index) =>
            score + (answer === questions[index].correctAnswer ? 1 : 0),
          0
        )}
        totalQuestions={questions.length}
        questions={questions.map((q, index) => ({
          ...q,
          userAnswer: answers[index],
        }))}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <Timer
        duration={timerDuration}
        onTimeUp={handleTimeUp}
        isActive={isTestStarted && !isTestComplete}
        questionIndex={currentQuestionIndex}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <Question
          question={questions[currentQuestionIndex].question}
          options={questions[currentQuestionIndex].options}
          selectedAnswer={answers[currentQuestionIndex]}
          onSelectAnswer={handleAnswerSelect}
        />

        <div className="flex justify-center">
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {currentQuestionIndex === questions.length - 1
              ? "Submit"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
