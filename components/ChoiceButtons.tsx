import React from 'react';

interface ChoiceButtonsProps {
  choices: string[];
  onChoice: (choice: string) => void;
  isLoading: boolean;
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ choices, onChoice, isLoading }) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => onChoice(choice)}
          disabled={isLoading}
          className="w-full text-left p-4 bg-gray-800 hover:bg-cyan-900/50 border border-gray-700 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="text-gray-300">{choice}</span>
        </button>
      ))}
    </div>
  );
};

export default ChoiceButtons;
