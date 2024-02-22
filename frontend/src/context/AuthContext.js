import { createContext, useReducer, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    case 'GET_PROFILE':
      return {
        ...state,
        users: action.payload,
      };
    case 'UPDATE_ACCOUNT_INFO':
      return {
        ...state,
        users: { ...state.users, ...action.payload },
      };
    case 'DELETE_ACCOUNT':
      return { user: null }


    default:
      return state
  }
}
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [loading, setLoading] = useState(true); // Add loading state
  const updateProfile = (updatedData) => {
    dispatch({ type: 'UPDATE_ACCOUNT_INFO', payload: updatedData });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    } else {
      console.log('No user found in localStorage.');
    }

    // Set loading to false after checking localStorage
    setLoading(false);
  }, []);

  console.log('AuthContext state:', state);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator
  }

  return (
    <AuthContext.Provider value={{ ...state, dispatch, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};


