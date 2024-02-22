import { createContext, useReducer , dispatch} from 'react';

export const ProjectsContext = createContext();
export const projectssReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PROJECTS':
      return {
        ...state,
        projects: action.payload
      };
    case 'GET_PROJECT':
      return {
        ...state,
        project: action.payload
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        project: action.payload
      };
    case 'CREATE_PROJECT':
      return {
        ...state,
        project: action.payload
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        project: { ...state.project, ...action.payload },
      }
    // Add a new action type for objectification
    case 'SET_OBJECTIFY_STATE_PROJECT':
      return {
        ...state,
        isObjectifyingProject: action.payload,
      };

    case 'GET_RECOMMENDATIONS':
      return {
        ...state,
        recommendations: action.payload
      };
    default:
      return state;
  }
};


export const ProjectsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectssReducer, {
    projects: null,
    project: null,
    isObjectifyingProject: false, // Add the new state variable
    recommendations: null  // Add recommendations to state
  });

  const updateProject = (updatedCode) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: updatedCode });
  };
  return (
    <ProjectsContext.Provider value={{ ...state, dispatch, updateProject, isObjectifyingProject: state.isObjectifyingProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};
