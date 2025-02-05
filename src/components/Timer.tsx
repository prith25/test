import React, { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
  questionIndex: number;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive, questionIndex }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, questionIndex]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeUp, isActive]);

  const getColor = () => {
    if (timeLeft <= 3) return "text-red-500";
    if (timeLeft <= 5) return "text-orange-500";
    return "text-gray-700";
  };

  return (
    <div
      className={`fixed top-4 right-4 font-mono text-2xl font-bold ${getColor()} 
        bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg
        animate-fade-in transition-colors duration-300`}
    >
      {timeLeft}s
    </div>
  );
};

export default Timer;
