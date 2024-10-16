import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface FlashcardData {
  question: string;
  answer: string;
}

interface FlashcardProps {
  cards: FlashcardData[];
  title: string;
}

const FlashcardComponent: React.FC<{ card: FlashcardData; flipped: boolean; onClick: () => void }> = ({ card, flipped, onClick }) => (
  <div 
    className={`w-full h-64 bg-white shadow-lg rounded-lg p-6 cursor-pointer transition-all duration-300 transform ${flipped ? 'rotate-y-180' : ''}`} 
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    role="button"
    tabIndex={0}
    aria-label={flipped ? "Show question" : "Show answer"}
  >
    <div className={`w-full h-full flex items-center justify-center text-center ${flipped ? 'hidden' : ''}`} aria-hidden={flipped}>
      <p className="text-xl font-semibold">{card.question}</p>
    </div>
    <div className={`w-full h-full flex items-center justify-center text-center ${flipped ? '' : 'hidden'}`} aria-hidden={!flipped}>
      <p className="text-xl">{card.answer}</p>
    </div>
  </div>
);

const FlashcardApp: React.FC<FlashcardProps> = ({ cards, title }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    setFlipped(false);
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setFlipped(false);
  };

  useEffect(() => {
    cardRef.current?.focus();
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <div className="w-full max-w-lg" ref={cardRef}>
        <FlashcardComponent 
          card={cards[currentIndex]} 
          flipped={flipped} 
          onClick={() => setFlipped(!flipped)} 
        />
      </div>
      <div className="flex justify-between w-full max-w-lg mt-6">
        <button 
          onClick={prevCard} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          aria-label="Previous card"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={resetCards} 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          aria-label="Reset cards"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={nextCard} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          aria-label="Next card"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <p className="mt-4 text-gray-600" aria-live="polite">Card {currentIndex + 1} of {cards.length}</p>
    </div>
  );
};

export default FlashcardApp;