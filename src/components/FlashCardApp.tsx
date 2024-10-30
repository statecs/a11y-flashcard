import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

interface FlashcardData {
  question: string;
  answer: string;
}

interface FlexibleOverviewData {
  [key: string]: string;
}

interface FlashcardProps {
  cards: FlashcardData[];
  title: string;
  overview?: FlexibleOverviewData[];
  onBack: () => void;
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

const OverviewDropdown: React.FC<{ overview: FlexibleOverviewData[] }> = ({ overview }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-lg mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-between items-center"
      >
        <span>Show Models Overview</span>
        {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
      {isOpen && (
        <div className="mt-2 bg-white rounded-lg shadow-md p-4">
          {overview.map((item, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-lg">{item.category}</h3>
              <p className="whitespace-pre-line">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FlashcardApp: React.FC<FlashcardProps> = ({ cards, title, overview, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };
  
    const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };
  
    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (isLeftSwipe) {
        nextCard();
      }
      if (isRightSwipe) {
        prevCard();
      }
    };


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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevCard();
      } else if (event.key === 'ArrowRight') {
        nextCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);  // Empty dependency array means this effect runs once on mount and clean up on unmount

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}>
      <div className="w-full max-w-lg mb-4">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <ArrowLeft size={24} className="mr-2" />
          Back to Start
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      {cards.length > 0 ? (
        <>
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
        </>
      ) : (
        <p className="text-gray-600">No flashcards available.</p>
      )}
      {overview && <OverviewDropdown overview={overview} />}
    </div>
  );
};

export default FlashcardApp;