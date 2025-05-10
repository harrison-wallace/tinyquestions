import React from 'react';

interface HomeProps {
  onSelectQuestionSet: (setName: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectQuestionSet }) => {
  // List of available question sets (you can dynamically fetch this later)
  const questionSets = [
    { name: 'cka', displayName: 'Kubernetes Certification Questions' },
    { name: 'aws', displayName: 'AWS Certification Questions' },
  ];

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Quiz Navigator</h1>
      <p className="text-xl text-center mb-6">Select a question set to begin:</p>
      <div className="space-y-4">
        {questionSets.map((set) => (
          <button
            key={set.name}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200"
            onClick={() => onSelectQuestionSet(set.name)}
            aria-label={`Start quiz with ${set.displayName}`}
          >
            {set.displayName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;