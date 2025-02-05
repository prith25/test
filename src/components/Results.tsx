import React, { useState } from "react";
import { motion } from "framer-motion";

interface ResultsProps {
  score: number;
  totalQuestions: number;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    userAnswer: number | null;
  }>;
}

const Results: React.FC<ResultsProps> = ({ score, totalQuestions, questions }) => {
  const [showDetails, setShowDetails] = useState(false);

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto p-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Test Complete!</h1>
        <div className="text-2xl mb-6">
          Your Score:{" "}
          <span className="font-bold text-primary">{score}/{totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {showDetails ? "Hide" : "View"} Detailed Results
        </button>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {questions.map((q, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <h3 className="font-medium mb-4">
                Question {index + 1}: {q.question}
              </h3>
              <div className="space-y-2">
                {q.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-3 rounded ${
                      optIndex === q.correctAnswer
                        ? "bg-green-100"
                        : optIndex === q.userAnswer
                        ? "bg-red-100"
                        : "bg-gray-50"
                    }`}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option}
                    {optIndex === q.correctAnswer && (
                      <span className="ml-2 text-green-600">(Correct)</span>
                    )}
                    {optIndex === q.userAnswer &&
                      optIndex !== q.correctAnswer && (
                        <span className="ml-2 text-red-600">(Your Answer)</span>
                      )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Results;
