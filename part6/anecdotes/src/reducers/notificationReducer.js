import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification: (state, action) => {
            return action.payload;
        },
        clearNotification: (state) => { 
            return ''
        }
    },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const showNotification = (message, duration) => {
    return (dispatch) => {
        dispatch(setNotification(message));
        setTimeout(() => {
            dispatch(clearNotification());
        }, duration*1000);
    };
};

export default notificationSlice.reducer;