import { configureStore, createSlice } from '@reduxjs/toolkit';
const initialAuthState = {
    token: null,
    isLoggedIn: false,
}
const authSlice = createSlice({
    name: 'isAuthenticated',
    initialState: initialAuthState,
    reducers: {
        login(state,action) {
            localStorage.setItem('token', action.payload);
            state.token =action.payload
            state.isLoggedIn=true
        },
        logout(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            state.token = null;
            state.isLoggedIn=false;
        }
    }

})
export const authActions = authSlice.actions;
const store=configureStore({
    reducer:{
        auth:authSlice.reducer,
    }
})
export default store;