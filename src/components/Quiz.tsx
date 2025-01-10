import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

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
        // Toggle selection
        return prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index];
      });
    }
  };

  const handleCheckAnswers = (): void => {
    setShowFeedback(true);
    const currentQuestionData = questions[currentQuestion];
    
    // Check if selected answers exactly match correct answers
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

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{title} - Quiz Completed</h1>
        <p className="text-xl mb-4 text-gray-800 dark:text-gray-200">Your score: {score} out of {questions.length}</p>
        <button
          onClick={restartQuiz}
          className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Restart Quiz
        </button>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
        >
          Back to Start
        </button>
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-lg mb-4">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <ArrowLeft size={24} className="mr-2" />
          Back to Start
        </button>
      </div>
      
      <h1 className="text-xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">{title} - Quiz</h1>
      
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
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

      <div className="flex justify-end w-full max-w-lg mt-6">
        {!showFeedback && selectedAnswers.length > 0 && (
          <button
            onClick={handleCheckAnswers}
            className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Check Answers
          </button>
        )}
        {showFeedback && (
          <button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 flex text-white font-bold py-2 pl-4 pr-2 rounded"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;