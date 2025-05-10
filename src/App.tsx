import React, { useState, useEffect, useCallback } from 'react';
import Home from './Home';

interface Question {
  id: number;
  text: string;
  options?: string[];
  correctAnswer: string;
  hint?: {
    text: string;
    link?: string;
  };
  explanation?: string;
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showReview, setShowReview] = useState(false);

  const handleSubmit = useCallback(() => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    saveQuizResult(correctCount);
  }, [questions, userAnswers]);

  useEffect(() => {
    if (selectedSet && !showSettings && !showReview) {
      import(`./questions/${selectedSet}.json`)
        .then((data) => {
          let loadedQuestions = data.default.questions;
          if (shuffleQuestions) {
            loadedQuestions = [...loadedQuestions].sort(() => Math.random() - 0.5);
          }
          setQuestions(loadedQuestions);
        })
        .catch((err) => {
          console.error('Failed to load question set:', err);
          setQuestions([]);
        });
    }
  }, [selectedSet, showSettings, shuffleQuestions, showReview]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev !== null ? prev - 1 : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, handleSubmit]);

  const handleAnswerChange = (answer: string) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowHint(false);
    }
  };

  const saveQuizResult = (score: number) => {
    const result = {
      setName: selectedSet,
      score,
      totalQuestions: questions.length,
      timestamp: new Date().toISOString(),
    };
    const storedResults = localStorage.getItem('quizResults');
    const results = storedResults ? JSON.parse(storedResults) : [];
    results.push(result);
    localStorage.setItem('quizResults', JSON.stringify(results));
  };

  const handleSelectQuestionSet = (setName: string) => {
    setSelectedSet(setName);
    setShowSettings(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
    setShowHint(false);
    setShuffleQuestions(false);
    setTimer(null);
    setTimeLeft(null);
    setShowReview(false);
  };

  const handleStartQuiz = () => {
    setShowSettings(false);
    if (timer) {
      setTimeLeft(timer * 60);
    }
  };

  const handleBackToHome = () => {
    setSelectedSet(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
    setShowHint(false);
    setShowSettings(false);
    setShuffleQuestions(false);
    setTimer(null);
    setTimeLeft(null);
    setShowReview(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!selectedSet) {
    return <Home onSelectQuestionSet={handleSelectQuestionSet} />;
  }

  if (showSettings) {
    return (
      <div className="w-full max-w-2xl lg:max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md min-h-fit">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Quiz Settings</h1>
        <p className="text-center mb-4 text-gray-800 dark:text-gray-200 text-sm sm:text-base lg:text-lg">
          Configure your quiz
        </p>
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Configure your quiz:</h2>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="shuffle"
              checked={shuffleQuestions}
              onChange={(e) => setShuffleQuestions(e.target.checked)}
              className="mr-3 h-5 w-5 text-blue-600"
            />
            <label htmlFor="shuffle" className="text-sm sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200">Shuffle questions</label>
          </div>
          <div className="flex items-center mb-4">
            <select
              id="timer"
              value={timer || ''}
              onChange={(e) => setTimer(e.target.value ? parseInt(e.target.value) : null)}
              className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 text-sm sm:text-base lg:text-lg"
            >
              <option value="">No timer</option>
              <option value="10">10 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
            </select>
            <label htmlFor="timer" className="ml-3 text-sm sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200">Set timer</label>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
            onClick={handleBackToHome}
            aria-label="Back to home"
          >
            Back
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
            onClick={handleStartQuiz}
            aria-label="Start quiz"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (score !== null && !showReview) {
    return (
      <div className="w-full max-w-2xl lg:max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md min-h-fit">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Quiz Results</h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-center mb-4 text-gray-800 dark:text-gray-200">
          Your score: <span className="font-semibold">{score}</span> / {questions.length}
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
            onClick={() => setShowReview(true)}
            aria-label="Review answers"
          >
            Review Answers
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
            onClick={() => {
              setScore(null);
              setUserAnswers({});
              setCurrentQuestionIndex(0);
              setShowHint(false);
              setShowReview(false);
            }}
            aria-label="Restart quiz"
          >
            Restart Quiz
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
            onClick={handleBackToHome}
            aria-label="Back to home"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <div className="w-full max-w-2xl lg:max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md min-h-fit">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Review Answers</h1>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="p-3 sm:p-4 lg:p-5 bg-white dark:bg-gray-700 rounded-lg shadow">
              <p className="text-lg sm:text-xl lg:text-2xl font-medium mb-2 text-gray-800 dark:text-gray-200">
                Question {index + 1}: {question.text}
              </p>
              <p className="text-sm sm:text-lg lg:text-xl mb-2 text-gray-800 dark:text-gray-200">
                Your Answer: <span className={userAnswers[index] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}>{userAnswers[index] || 'Not answered'}</span>
              </p>
              <p className="text-sm sm:text-lg lg:text-xl mb-2 text-gray-800 dark:text-gray-200">Correct Answer: {question.correctAnswer}</p>
              {question.explanation && (
                <p className="text-sm sm:text-lg lg:text-xl mb-2 text-gray-800 dark:text-gray-200">Explanation: {question.explanation}</p>
              )}
              {question.hint && (
                <div>
                  <p className="text-sm sm:text-lg lg:text-xl mb-2 text-gray-800 dark:text-gray-200">Hint: {question.hint.text}</p>
                  {question.hint.link && (
                    <a
                      href={question.hint.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400 text-sm sm:text-base lg:text-lg"
                      aria-label="Official documentation"
                    >
                      Official Documentation
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
            onClick={() => setShowReview(false)}
            aria-label="Back to results"
          >
            Back to Results
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
            onClick={handleBackToHome}
            aria-label="Back to home"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="w-full max-w-2xl lg:max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full max-w-2xl lg:max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md min-h-fit">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-600 dark:text-blue-400">Quiz Navigator</h1>
        {timeLeft !== null && (
          <div className="text-sm sm:text-lg lg:text-xl font-medium text-red-600 dark:text-red-400">
            Time Left: {formatTime(timeLeft)}
          </div>
        )}
      </div>
      <div className="mb-6">
        <p className="text-lg sm:text-xl lg:text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">
          Question {currentQuestionIndex + 1} of {questions.length}: {currentQuestion.text}
        </p>
        {currentQuestion.hint && (
          <div className="mb-4">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white px-3 py-1 sm:px-4 sm:py-2 lg:px-5 lg:py-3 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
              onClick={() => setShowHint(!showHint)}
              aria-label={showHint ? 'Hide hint' : 'Show hint'}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && (
              <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <p className="text-sm sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200">{currentQuestion.hint.text}</p>
                {currentQuestion.hint.link && (
                  <a
                    href={currentQuestion.hint.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400 text-sm sm:text-base lg:text-lg"
                    aria-label="Official documentation"
                  >
                    Official Documentation
                  </a>
                )}
              </div>
            )}
          </div>
        )}
        {currentQuestion.options ? (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="answer"
                  value={option}
                  checked={userAnswers[currentQuestionIndex] === option}
                  onChange={() => handleAnswerChange(option)}
                  className="mr-3 h-5 w-5 text-blue-600"
                />
                <label htmlFor={`option-${index}`} className="text-sm sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200">{option}</label>
              </div>
            ))}
          </div>
        ) : (
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 text-sm sm:text-base lg:text-lg"
            value={userAnswers[currentQuestionIndex] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            aria-label="Answer input for open-ended question"
          />
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-sm sm:text-base lg:text-lg"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          aria-label="Previous question"
        >
          Previous
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-sm sm:text-base lg:text-lg"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          aria-label="Next question"
        >
          Next
        </button>
        {currentQuestionIndex === questions.length - 1 && (
          <button
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg transition duration-200 text-sm sm:text-base lg:text-lg"
            onClick={handleSubmit}
            aria-label="Submit quiz"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default App;