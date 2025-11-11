import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { initializeAiClient, isAiClientInitialized } from '../services/geminiService.ts';

interface ApiKeyContextType {
  apiKey: string | null;
  isKeySet: boolean;
  setApiKey: (key: string) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, _setApiKey] = useState<string | null>(() => localStorage.getItem('gemini-api-key'));

  useEffect(() => {
    // Initialize the client on first load if a key exists
    if (apiKey && !isAiClientInitialized()) {
      try {
        initializeAiClient(apiKey);
      } catch (error) {
         console.error("Failed to initialize AI client with stored key:", error);
         // Clear the bad key
         localStorage.removeItem('gemini-api-key');
         _setApiKey(null);
      }
    }
  }, [apiKey]);

  const setApiKey = (key: string) => {
    const trimmedKey = key.trim();
    if(trimmedKey) {
        localStorage.setItem('gemini-api-key', trimmedKey);
        initializeAiClient(trimmedKey);
        _setApiKey(trimmedKey);
    }
  };

  const isKeySet = !!apiKey;

  return (
    <ApiKeyContext.Provider value={{ apiKey, isKeySet, setApiKey }}>
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