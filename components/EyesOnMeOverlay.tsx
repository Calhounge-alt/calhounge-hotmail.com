import React from 'react';

interface EyesOnMeOverlayProps {
  isActive: boolean;
  onDismiss: () => void;
}

const EyesOnMeOverlay: React.FC<EyesOnMeOverlayProps> = ({ isActive, onDismiss }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-blue-900/90 z-[100] flex flex-col items-center justify-center text-white p-4 animate-fade-in-up">
      <div className="text-8xl mb-6">👀</div>
      <h2 className="text-5xl md:text-6xl font-bold mb-4 text-center">Eyes on Me!</h2>
      <p className="text-xl md:text-2xl text-blue-200 mb-8">Please pause and listen for instructions.</p>
      <button
        onClick={onDismiss}
        className="bg-white text-blue-800 font-bold py-3 px-12 rounded-lg text-xl hover:bg-gray-200 transition-transform transform hover:scale-105"
      >
        Dismiss
      </button>
    </div>
  );
};

export default EyesOnMeOverlay;
