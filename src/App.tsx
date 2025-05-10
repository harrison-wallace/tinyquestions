import React, { useState, useEffect } from 'react';
import Home from './Home';

interface Question {
  id: number;
  text: string;
  options?: string[];
  correctAnswer: string;
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSet) {
      // Dynamically import the selected question set
      import(`./questions/${selectedSet}.json`)
        .then((data) => {
          setQuestions(data.default.questions);
        })
        .catch((err) => {
          console.error('Failed to load question set:', err);
          setQuestions([]);
        });
    }
  }, [selectedSet]);

  const handleAnswerChange = (answer: string) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  const handleSelectQuestionSet = (setName: string) => {
    setSelectedSet(setName);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
  };

  const handleBackToHome = () => {
    setSelectedSet(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
  };

  if (!selectedSet) {
    return <Home onSelectQuestionSet={handleSelectQuestionSet} />;
  }

  if (score !== null) {
    return (
      <div className="container mx-auto p-6 max-w-2xl bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Quiz Results</h1>
        <p className="text-xl text-center mb-4">
          Your score: <span className="font-semibold">{score}</span> / {questions.length}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200"
            onClick={() => {
              setScore(null);
              setUserAnswers({});
              setCurrentQuestionIndex(0);
            }}
            aria-label="Restart quiz"
          >
            Restart Quiz
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition duration-200"
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
    return <div className="container mx-auto p-6 text-center text-gray-500">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Quiz Navigator</h1>
      <div className="mb-6">
        <p className="text-xl font-medium mb-4">
          Question {currentQuestionIndex + 1} of {questions.length}: {currentQuestion.text}
        </p>
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
                <label htmlFor={`option-${index}`} className="text-lg">{option}</label>
              </div>
            ))}
          </div>
        ) : (
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userAnswers[currentQuestionIndex] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            aria-label="Answer input for open-ended question"
          />
        )}
      </div>
      <div className="flex justify-between">
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          aria-label="Previous question"
        >
          Previous
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          aria-label="Next question"
        >
          Next
        </button>
        {currentQuestionIndex === questions.length - 1 && (
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-200"
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