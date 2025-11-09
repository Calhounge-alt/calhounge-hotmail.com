import React from 'react';

interface WelcomeScreenProps {
  onNameSet: (name: string) => void;
}

// This screen's UI is now handled by the OnboardingModal.
// This component remains as a placeholder for the 'welcome' step in the application flow,
// rendering nothing while the modal is active.
const WelcomeScreen: React.FC<WelcomeScreenProps> = () => {
  return null;
};

export default WelcomeScreen;