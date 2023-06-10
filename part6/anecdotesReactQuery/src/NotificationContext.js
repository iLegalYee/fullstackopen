import React, { createContext, useReducer } from 'react';

const NotificationContext = createContext();

const initialState = {
  message: '',
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { message: action.payload };
    case 'CLEAR_MESSAGE':
      return { message: '' };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const setMessage = (message) => {
    dispatch({ type: 'SET_MESSAGE', payload: message });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_MESSAGE' });
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ message: state.message, setMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext