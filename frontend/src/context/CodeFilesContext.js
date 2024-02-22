import { createContext, useReducer, useContext } from 'react';

export const CodeFilesContext = createContext();
export const codeFileReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_CODE':
      return {
        ...state,
        codeFiles: { ...state.codeFiles, ...action.payload }
      };
    default:
      return state;
  }
};

export const CodeFilesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(codeFileReducer, {
    codeFiles: null
  });

  return (
    <CodeFilesContext.Provider value={{ state, dispatch }}>
      {children}
    </CodeFilesContext.Provider>
  );
};