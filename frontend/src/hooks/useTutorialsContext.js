import { useContext } from 'react';
import { TutorialsContext } from '../context/TutorialsContext';

export const useTutorialsContext = () => {
  const context = useContext(TutorialsContext);

  if (!context) {
    throw new Error('useTutorialsContext must be used inside a TutorialsContextProvider');
  }

  return context;
};

