import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

interface QuizResult {
  setName: string;
  score: number;
  totalQuestions: number;
  timestamp: string;
}

const Statistics: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [results, setResults] = useState<QuizResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  const clearStatistics = () => {
    if (window.confirm('Are you sure you want to clear all statistics?')) {
      localStorage.removeItem('quizResults');
      setResults([]);
    }
  };

  const getAverageScore = () => {
    if (results.length === 0) return 0;
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return (totalScore / results.length).toFixed(2);
  };

  const getCompletionRate = () => {
    if (results.length === 0) return 0;
    const completed = results.filter((result) => result.score >= 0).length;
    return ((completed / results.length) * 100).toFixed(2);
  };

  return (
    <div className="w-full max-w-2xl lg:max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md min-h-fit">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-600 dark:text-blue-400">
          Quiz Statistics
        </h1>
        <button
          className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-1 sm:px-4 sm:py-2 lg:px-5 lg:py-3 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="mb-6">
        <p className="text-lg sm:text-xl lg:text-2xl mb-2 text-gray-800 dark:text-gray-200">Average Score: {getAverageScore()}</p>
        <p className="text-lg sm:text-xl lg:text-2xl mb-2 text-gray-800 dark:text-gray-200">Completion Rate: {getCompletionRate()}%</p>
        <p className="text-lg sm:text-xl lg:text-2xl mb-2 text-gray-800 dark:text-gray-200">Total Attempts: {results.length}</p>
      </div>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium mb-4 text-gray-800 dark:text-gray-200">Recent Results</h2>
      <div className="space-y-4 mb-6">
        {results.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg">No results yet.</p>
        ) : (
          results.slice(0, 5).map((result, index) => (
            <div key={index} className="p-3 sm:p-4 lg:p-5 bg-white dark:bg-gray-700 rounded-lg shadow">
              <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-base lg:text-lg">{result.setName} - Score: {result.score}/{result.totalQuestions}</p>
              <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400">{new Date(result.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          Back
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
          onClick={clearStatistics}
          aria-label="Clear statistics"
        >
          Clear Statistics
        </button>
      </div>
    </div>
  );
};

export default Statistics;