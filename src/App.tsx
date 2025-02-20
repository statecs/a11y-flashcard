import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate, useParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

import FlashcardApp from './components/FlashCardApp';
import Quiz, { QuizQuestion } from './components/Quiz';

import { ThemeProvider } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

import modelsOfDisabilityData from './data/modelsOfDisability.json';
import categoriesOfDisabilitiesData from './data/categoriesOfDisabilities.json';
import assistiveTechnologiesAndDisabilitiesData from './data/assistiveTechnologiesAndDisabilities.json';
import demographicsAndStatistics from './data/demographicsAndStatistics.json';
import disabilityEtiquette from './data/disabilityEtiquette.json';

interface FlexibleOverviewData {
  [key: string]: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  data: {
    title: string;
    cards: Array<{ question: string; answer: string }>;
    overview: FlexibleOverviewData[];
    quizQuestions: QuizQuestion[];
  };
}

const chapters: Chapter[] = [
  {
    id: 'models-of-disability',
    title: 'Models of Disability',
    description: 'Learn about different theoretical models of disability through interactive flashcards.',
    data: modelsOfDisabilityData as Chapter['data']
  },
  {
    id: 'categories-of-disabilities',
    title: 'Categories of Disabilities',
    description: 'Learn about different disabilities through interactive flashcards and quiz',
    data: categoriesOfDisabilitiesData as Chapter['data']
  },
  {
    id: 'assistive-technologies-and-disabilities',
    title: 'Assistive Technologies and Disabilities',
    description: 'Learn about technologies that help people with disabilities access digital and physical environments.',
    data: assistiveTechnologiesAndDisabilitiesData as Chapter['data']
  },
  {
    id: 'demographics-and-statistics',
    title: 'Demographics and Statistics',
    description: 'Learn about demographics and statistics - One in seven people worldwide lives with a disability, making it the worlds largest minority group,',
    data: demographicsAndStatistics as Chapter['data']
  },
  {
    id: 'disability-and-etiquette',
    title: 'Disability and Etiquette',
    description: 'A comprehensive guide on respectful interaction with people with disabilities',
    data: disabilityEtiquette as Chapter['data']
  },
];

const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
    <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">A11y Learning Hub</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {chapters.map((chapter) => (
        <div key={chapter.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
            <BookOpen className="mr-2" size={24} />
            {chapter.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{chapter.description}</p>
          <div className="flex space-x-4">
            <Link
              to={`/chapter/${chapter.id}/flashcards`}
              className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            >
              Flashcards
            </Link>
            <Link
              to={`/chapter/${chapter.id}/quiz`}
              className="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
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
  const { chapterId } = useParams<{ chapterId: string }>();
  
  const chapter = chapters.find(c => c.id === chapterId);
  
  if (!chapter) {
    return <ChapterNotFound />;
  }

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Quiz 
      questions={chapter.data.quizQuestions}
      title={chapter.data.title}
      onBack={handleBack}
    />
  );
};

const FlashcardWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams<{ chapterId: string }>();
  
  const chapter = chapters.find(c => c.id === chapterId);
  
  if (!chapter) {
    return <ChapterNotFound />;
  }

  const handleBack = () => {
    navigate('/');
  };

  return (
    <FlashcardApp 
      cards={chapter.data.cards}
      title={chapter.data.title}
      overview={chapter.data.overview}
      onBack={handleBack}
    />
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <Router basename={process.env.PUBLIC_URL}>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/chapter/:chapterId/flashcards" 
          element={<FlashcardWrapper />}
        />
        <Route 
          path="/chapter/:chapterId/quiz" 
          element={<QuizWrapper />}
        />
        <Route path="*" element={<ChapterNotFound />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;