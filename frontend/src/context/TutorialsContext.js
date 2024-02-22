import { createContext, useReducer, useContext } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";

export const TutorialsContext = createContext();

export const tutorialsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TUTORIALS':
      return {
        ...state,
        tutorials: action.payload
      };
    case 'GET_ENROLLED_TUTORIALS':
      return {
        ...state,
        enrolledTutorials: action.payload
      };
    case 'GET_TUTORIAL':
      return {
        ...state,
        tutorial: action.payload
      };
    case 'ENROLL_TUTORIAL_SUCCESS':
      return {
        ...state,
        enrolledTutorials: [...(state.enrolledTutorials || []), { tutorialId: action.payload.tutorialId, language: action.payload.language }],
      };
    case 'ENROLL_TUTORIAL_FAILURE':
      // Handle failure, you may want to show an error message to the user
      return state;
    // Add other cases as needed
    case 'SET_OBJECTIFY_STATE_TUTORIAL':
      return {
        ...state,
        isObjectifyingTutorial: action.payload,
      };

    default:
      return state;
  }
};

export const TutorialsContextProvider = ({ children }) => {
  const user = useAuthContext();

  const [state, dispatch] = useReducer(tutorialsReducer, {
    tutorials: null,
    enrolledTutorials: null,
    tutorial: null,
    isObjectifyingTutorial: false
  });
  return (
    <TutorialsContext.Provider value={{ ...state, dispatch, user, isObjectifyingTutorial: state.isObjectifyingTutorial }}>
      {children}
    </TutorialsContext.Provider>
  );
};

export const useTutorialsContext = () => {
  return useContext(TutorialsContext);
};

export const enrollTutorialAction = async (dispatch, selectedLanguage, tutorialId, user) => {
  try {
    const userString = localStorage.getItem('user');

    // Parse the user JSON string into a JavaScript object
    const person = JSON.parse(userString);

    // Access the 'userID' attribute from the object
    const userID = person.userID;

    console.log(tutorialId);
    console.log(user.user.token);

    const response = await fetch(`/api/tutorials/${tutorialId}/enroll`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userID, selectedLanguage })
    });




    const json = await response.json();

    if (response.ok) {
      // console.log("Cool");
      dispatch({ type: 'ENROLL_TUTORIAL_SUCCESS', payload: json });
    } else {
      dispatch({ type: 'ENROLL_TUTORIAL_FAILURE' });
    }
  } catch (error) {
    console.error('Error enrolling tutorial:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Server error:', error.response.status, error.response.statusText);
    }
    dispatch({ type: 'ENROLL_TUTORIAL_FAILURE' });
  }
};