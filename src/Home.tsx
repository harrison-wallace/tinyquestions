import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

interface HomeProps {
  onSelectQuestionSet: (setName: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectQuestionSet }) => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const questionSets = [
    { name: 'cka', displayName: 'Kubernetes Certification Questions' },
    { name: 'aws', displayName: 'AWS Certification Questions' },
  ];

  return (
    <div className="w-full max-w-2xl lg:max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md min-h-fit">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-600 dark:text-blue-400">
          Quiz Navigator
        </h1>
        <button
          className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-1 sm:px-4 sm:py-2 lg:px-5 lg:py-3 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <p className="text-lg sm:text-xl lg:text-2xl text-center mb-6 text-gray-800 dark:text-gray-200">
        Select a question set to begin
      </p>
      <div className="space-y-4">
        {questionSets.map((set) => (
          <button
            key={set.name}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
            onClick={() => onSelectQuestionSet(set.name)}
            aria-label={`Select ${set.displayName}`}
          >
            {set.displayName}
          </button>
        ))}
        <button
          className="w-full bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
          onClick={() => navigate('/statistics')}
          aria-label="View statistics"
        >
          View Statistics
        </button>
      </div>
    </div>
  );
};

export default Home;