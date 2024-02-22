import { useContext } from 'react';
import { CodeFilesContext } from '../context/CodeFilesContext';

export const useCodeFilesContext = () => {
  const context = useContext(CodeFilesContext);

  if (!context) {
    throw new Error('useCodeFilesContext must be used inside a CodeFilesContextProvider');
  }

  return context;
};

