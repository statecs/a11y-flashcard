import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswers: number[];
}

interface RandomizedQuizQuestion extends QuizQuestion {
  randomizedOptions: string[];
  correctAnswerIndices: number[];
}

interface QuizProps {
  questions: QuizQuestion[];
  title: string;
  onBack: () => void;
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
  const correctAnswerIndices = question.correctAnswers.map(
    index => randomizedOptions.indexOf(question.options[index])
  );
  return {
    ...question,
    randomizedOptions,
    correctAnswerIndices
  };
};

const Quiz: React.FC<QuizProps> = ({ questions: initialQuestions, title, onBack }) => {
  const [questions, setQuestions] = useState<RandomizedQuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  // Add this new state to store answers for each question
  const [answersHistory, setAnswersHistory] = useState<number[][]>([]);


  useEffect(() => {
    const shuffledQuestions = shuffleArray(initialQuestions);
    const randomizedQuestions = shuffledQuestions.map(randomizeQuestion);
    setQuestions(randomizedQuestions);
  }, [initialQuestions]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswers(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

// Modify handleNext to save answers before moving to next question
const handleNext = () => {
  if (selectedAnswers.length > 0) {
    const currentQuestionData = questions[currentQuestion];
    
    // Save current answers to history
    setAnswersHistory(prev => {
      const newHistory = [...prev];
      newHistory[currentQuestion] = selectedAnswers;
      return newHistory;
    });
    
    // Check if selected answers exactly match correct answers
    const isExactMatch = 
      selectedAnswers.length === currentQuestionData.correctAnswerIndices.length &&
      selectedAnswers.every(answer => 
        currentQuestionData.correctAnswerIndices.includes(answer)
      );
    
    if (isExactMatch) {
      setScore(score + 1);
    }

    setSelectedAnswers([]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  }
};

// Modify handlePrevious to restore previous answers from history
const handlePrevious = () => {
  if (currentQuestion > 0) {
    const previousQuestionIndex = currentQuestion - 1;
    setCurrentQuestion(previousQuestionIndex);
    setSelectedAnswers(answersHistory[previousQuestionIndex] || []);
  }
};

// Modify restartQuiz to also reset the answers history
const restartQuiz = () => {
  const shuffledQuestions = shuffleArray(initialQuestions);
  const randomizedQuestions = shuffledQuestions.map(randomizeQuestion);
  setQuestions(randomizedQuestions);
  setCurrentQuestion(0);
  setSelectedAnswers([]);
  setScore(0);
  setQuizCompleted(false);
  setAnswersHistory([]); // Add this line
};

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8">{title} - Quiz Completed</h1>
        <p className="text-xl mb-4">Your score: {score} out of {questions.length}</p>
        <button
          onClick={restartQuiz}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Restart Quiz
        </button>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Start
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
                selectedAnswers.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
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
          disabled={selectedAnswers.length === 0}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Quiz;