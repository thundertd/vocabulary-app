import React, { useState, useEffect } from 'react';

interface PracticeInputProps {
  correctAnswer: string;
  onAnswer: (answer: string) => void;
  hintInterval: number;
  onHintRevealed: () => void;
}

export function PracticeInput({
  correctAnswer,
  onAnswer,
  hintInterval,
  onHintRevealed
}: PracticeInputProps) {
  const [userInput, setUserInput] = useState('');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(hintInterval);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Reveal a new hint
          const unrevealedIndices = Array.from(
            { length: correctAnswer.length },
            (_, i) => i
          ).filter(i => !revealedHints.includes(i));

          if (unrevealedIndices.length > 0) {
            const randomIndex = unrevealedIndices[
              Math.floor(Math.random() * unrevealedIndices.length)
            ];
            setRevealedHints(prev => [...prev, randomIndex]);
            onHintRevealed();
          }

          return hintInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [correctAnswer, hintInterval, revealedHints, onHintRevealed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswer(userInput);
    setUserInput('');
  };

  const renderHint = (index: number) => {
    if (revealedHints.includes(index)) {
      return correctAnswer[index];
    }
    return '_';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-lg font-mono">
          {Array.from(correctAnswer).map((_, index) => (
            <span key={index} className="mx-1">
              {renderHint(index)}
            </span>
          ))}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Time until next hint: {timeLeft}s
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your answer..."
          autoFocus
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
} 