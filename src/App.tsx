import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

// Import the FlashcardApp component (assuming it's in a separate file)
import ModelsOfDisability from './components/ModelsOfDisability';

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
  {
    id: 'accessibility-basics',
    title: 'Accessibility Basics',
    description: 'Understand the fundamentals of digital accessibility and inclusive design.'
  },
  {
    id: 'assistive-technologies',
    title: 'Assistive Technologies',
    description: 'Explore various assistive technologies and their impact on daily life.'
  }
];

const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-4xl font-bold mb-8 text-center">Learning Hub</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {chapters.map((chapter) => (
        <Link
          key={chapter.id}
          to={`/chapter/${chapter.id}`}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            <BookOpen className="mr-2" size={24} />
            {chapter.title}
          </h2>
          <p className="text-gray-600">{chapter.description}</p>
        </Link>
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

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chapter/models-of-disability" element={<ModelsOfDisability />} />
      <Route path="/chapter/:chapterId" element={<ChapterNotFound />} />
    </Routes>
  </Router>
);

export default App;