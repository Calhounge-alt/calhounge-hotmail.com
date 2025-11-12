import React, { createContext, useContext, ReactNode } from 'react';

// Per new guidelines, API key should not be managed through UI.
// This component and hook are deprecated and made non-functional to resolve build errors
// and align with the requirement of using process.env.API_KEY exclusively.

interface ApiKeyContextType {
  apiKey: string | null;
  isKeySet: boolean;
  setApiKey: (key: string) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = {
    apiKey: null,
    isKeySet: true, // Assume key is set via environment variables.
    setApiKey: () => { /* no-op */ },
  };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
