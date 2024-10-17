import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

// Import the FlashcardApp component
import FlashcardApp from './components/FlashCardApp';
import Quiz from './components/Quiz';

// Import JSON data
import modelsOfDisabilityData from './data/modelsOfDisability.json';

interface Chapter {
  id: string;
  title: string;
  description: string;
}

const chapters: Chapter[] = [
  {
    id: 'models-of-disability',
    title: 'Models of Disability',
    description: 'Learn about different theoretical models of disability through interactive flashcards.'
  },
  // Add more chapters here as needed
];

const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-4xl font-bold mb-8 text-center">A11y Learning Hub</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {chapters.map((chapter) => (
        <div key={chapter.id} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            <BookOpen className="mr-2" size={24} />
            {chapter.title}
          </h2>
          <p className="text-gray-600 mb-4">{chapter.description}</p>
          <div className="flex space-x-4">
            <Link
              to={`/chapter/${chapter.id}/flashcards`}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Flashcards
            </Link>
            <Link
              to={`/chapter/${chapter.id}/quiz`}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Quiz
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChapterNotFound: React.FC = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold mb-4">Chapter Not Found</h1>
    <p className="text-xl mb-8">Sorry, the requested chapter is not available.</p>
    <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Return to Home
    </Link>
  </div>
);

const QuizWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <Quiz 
      questions={modelsOfDisabilityData.quizQuestions} 
      title={modelsOfDisabilityData.title}
      onBack={handleBack}
    />
  );
};

const FlashcardWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <FlashcardApp 
      cards={modelsOfDisabilityData.cards} 
      title={modelsOfDisabilityData.title} 
      overview={modelsOfDisabilityData.overview}
      onBack={handleBack}
    />
  );
};


const App: React.FC = () => (
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/chapter/models-of-disability/flashcards" 
        element={<FlashcardWrapper />}
      />
      <Route 
        path="/chapter/models-of-disability/quiz" 
        element={<QuizWrapper />}
      />
      <Route path="/chapter/:chapterId" element={<ChapterNotFound />} />
    </Routes>
  </Router>
);

export default App;