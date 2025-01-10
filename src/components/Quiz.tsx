import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, CheckCircle2, XCircle, Trophy, Medal, Star } from 'lucide-react';
import type { Options as ConfettiOptions } from 'canvas-confetti';
import confetti from 'canvas-confetti';

// Simplified declaration for canvas-confetti
declare module 'canvas-confetti' {
  export interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    zIndex?: number;
  }
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation?: string;
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
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  
  useEffect(() => {
    const shuffledQuestions = shuffleArray(initialQuestions);
    const randomizedQuestions = shuffledQuestions.map(randomizeQuestion);
    setQuestions(randomizedQuestions);
  }, [initialQuestions]);

  const getRequiredSelectionsText = (question: RandomizedQuizQuestion): string => {
    const count = question.correctAnswerIndices.length;
    return count > 1 ? `(Select ${count} answers)` : '';
  };

  const handleAnswerSelect = (index: number): void => {
    if (!showFeedback) {
      setSelectedAnswers(prev => {
        return prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index];
      });
    }
  };

  const handleCheckAnswers = (): void => {
    setShowFeedback(true);
    const currentQuestionData = questions[currentQuestion];
    
    const isCorrect = 
      selectedAnswers.length === currentQuestionData.correctAnswerIndices.length &&
      selectedAnswers.every(answer => currentQuestionData.correctAnswerIndices.includes(answer)) &&
      currentQuestionData.correctAnswerIndices.every(answer => selectedAnswers.includes(answer));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = (): void => {
    setSelectedAnswers([]);
    setShowFeedback(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = (): void => {
    const shuffledQuestions = shuffleArray(initialQuestions);
    const randomizedQuestions = shuffledQuestions.map(randomizeQuestion);
    setQuestions(randomizedQuestions);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setScore(0);
    setQuizCompleted(false);
    setShowFeedback(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "🏆 Perfect Score! You're a Star! 🌟";
    if (percentage >= 90) return "🎯 Almost Perfect! Incredible Job! 🌟";
    if (percentage >= 80) return "🎨 Great Work! You're Getting There! 💪";
    if (percentage >= 70) return "📚 Good Effort! Keep Learning! 📖";
    return "🌱 Room for Growth! Try Again! 🔄";
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  useEffect(() => {
    if (quizCompleted && score === questions.length) {
      triggerConfetti();
    }
  }, [quizCompleted, score]);

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    const scoreColor = percentage === 100 
      ? 'text-yellow-500 dark:text-yellow-300'
      : percentage >= 80 
        ? 'text-green-500 dark:text-green-300'
        : 'text-blue-500 dark:text-blue-300';

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{title} - Quiz Completed</h1>
        
        <div className={`text-4xl mb-6 ${scoreColor} animate-bounce`}>
          {percentage === 100 ? <Trophy size={64} /> : 
           percentage >= 90 ? <Medal size={64} /> :
           percentage >= 80 ? <Star size={64} /> : '🎯'}
        </div>

        <h2 className={`text-2xl font-bold mb-4 ${scoreColor}`}>
          {getScoreMessage()}
        </h2>

        <div className="text-xl mb-8 text-gray-800 dark:text-gray-200">
          <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span> out of {questions.length} correct!
        </div>

        <div className="space-y-4">
          <button
            onClick={restartQuiz}
            className="w-full bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transform transition hover:scale-105"
          >
            Try Again 🔄
          </button>
          <button
            onClick={onBack}
            className="w-full bg-gray-500 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transform transition hover:scale-105"
          >
            Back to Start ↩
          </button>
        </div>

        {percentage >= 90 && percentage < 100 && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400 animate-pulse">
            So close to perfection! Give it another shot! 🎯
          </div>
        )}
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestionData = questions[currentQuestion];
  const isCorrectAnswer = (index: number): boolean => 
    currentQuestionData.correctAnswerIndices.includes(index);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 relative pb-20 pt-4">
      <div className="max-w-3xl mx-auto p-4">
        {/* Top navigation and progress */}
        <div className="w-full mb-4">
          <button
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center mb-4"
          >
            <ArrowLeft size={24} className="mr-2" />
            Back to Start
          </button>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-500 dark:bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ 
                width: `${((currentQuestion + (showFeedback ? 1 : 0)) / questions.length) * 100}%`
              }}
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Progress: {currentQuestion + (showFeedback ? 1 : 0)} of {questions.length}
          </div>
        </div>

        <h1 className="text-xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
          {title}
        </h1>

        {/* Quiz content */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-24">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          
          <div className="mb-4">
            <p className="font-medium text-gray-900 dark:text-white">{currentQuestionData.question}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {getRequiredSelectionsText(currentQuestionData)}
            </p>
          </div>
          
          <div className="space-y-2">
            {currentQuestionData.randomizedOptions.map((option: string, index: number) => {
              const isSelected = selectedAnswers.includes(index);
              const isCorrect = isCorrectAnswer(index);
              
              let buttonStyle = "w-full text-left p-4 rounded flex justify-between items-center ";
              
              if (showFeedback) {
                if (isCorrect) {
                  buttonStyle += "border-2 border-green-500 bg-green-50 dark:bg-green-900/20 dark:text-white";
                } else if (isSelected) {
                  buttonStyle += "border-2 border-red-500 bg-red-50 dark:bg-red-900/20 dark:text-white";
                } else {
                  buttonStyle += "bg-gray-100 dark:bg-gray-700";
                }
              } else {
                buttonStyle += isSelected 
                  ? "bg-blue-500 dark:bg-blue-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={buttonStyle}
                  disabled={showFeedback}
                >
                  <span>{option}</span>
                  {showFeedback && (
                    isCorrect ? 
                      <CheckCircle2 className="text-green-500 dark:text-green-400" size={24} /> :
                      (isSelected && <XCircle className="text-red-500 dark:text-red-400" size={24} />)
                  )}
                </button>
              );
            })}
          </div>

          {showFeedback && currentQuestionData.explanation && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-blue-800 dark:text-blue-200">{currentQuestionData.explanation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed position button container */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-10">
        <div className="max-w-4xl mx-auto p-4 flex justify-end">
          {!showFeedback && selectedAnswers.length > 0 && (
            <button
              onClick={handleCheckAnswers}
              className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-3 px-6 rounded mr-2 transform transition hover:scale-105"
            >
              Check Answers ✓
            </button>
          )}
          {showFeedback && (
            <button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-3 px-6 rounded flex items-center transform transition hover:scale-105"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz 🎯' : 'Next Question ➡️'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;