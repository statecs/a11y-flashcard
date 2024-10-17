import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface RandomizedQuizQuestion extends QuizQuestion {
  randomizedOptions: string[];
  correctAnswerIndex: number;
}

interface QuizProps {
  questions: QuizQuestion[];
  title: string;
  onBack: () => void;  // New prop for handling navigation back to start screen
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const randomizeQuestion = (question: QuizQuestion): RandomizedQuizQuestion => {
  const randomizedOptions = shuffleArray(question.options);
  const correctAnswerIndex = randomizedOptions.indexOf(question.options[question.correctAnswer]);
  return {
    ...question,
    randomizedOptions,
    correctAnswerIndex
  };
};

const Quiz: React.FC<QuizProps> = ({ questions: initialQuestions, title, onBack }) => {
  const [questions, setQuestions] = useState<RandomizedQuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const shuffledQuestions = shuffleArray(initialQuestions);
    const randomizedQuestions = shuffledQuestions.map(randomizeQuestion);
    setQuestions(randomizedQuestions);
  }, [initialQuestions]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      if (selectedAnswer === questions[currentQuestion].correctAnswerIndex) {
        setScore(score + 1);
      }
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const restartQuiz = () => {
    const shuffledQuestions = shuffleArray(initialQuestions);
    const randomizedQuestions = shuffledQuestions.map(randomizeQuestion);
    setQuestions(randomizedQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8">{title} - Quiz Completed</h1>
        <p className="text-xl mb-4">Your score: {score} out of {questions.length}</p>
        <button
          onClick={restartQuiz}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-lg mb-4">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <ArrowLeft size={24} className="mr-2" />
          Back to Start
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-8">{title} - Quiz</h1>
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Question {currentQuestion + 1} of {questions.length}</h2>
        <p className="mb-4">{questions[currentQuestion].question}</p>
        <div className="space-y-2">
          {questions[currentQuestion].randomizedOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-2 rounded ${
                selectedAnswer === index ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between w-full max-w-lg mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Quiz;