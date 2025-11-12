import React from 'react';

// Per new guidelines, API key should not be managed through UI.
// This modal is deprecated and should not be rendered.

interface ApiKeyModalProps {
  isOpen: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = () => {
  return null;
};

export default ApiKeyModal;
