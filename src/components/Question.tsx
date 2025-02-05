import React from "react";
import { motion } from "framer-motion";

interface QuestionProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-xl font-serif mb-6 text-gray-800">{question}</h2>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(index)}
            className={`w-full p-4 text-left rounded-lg transition-all duration-200 
              ${
                selectedAnswer === index
                  ? "bg-primary text-white"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
          >
            <span className="font-medium">
              {String.fromCharCode(65 + index)}.
            </span>{" "}
            {option}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Question;
