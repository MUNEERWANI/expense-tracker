import { createSlice } from "@reduxjs/toolkit";
const initialDarkState={
    isDarkMode:false,
}
export const darkModeSlice=createSlice({
    name:'darkMode',
    initialState:initialDarkState,
    reducers:{
        toggleDarkMode (state) {
            state.isDarkMode=!state.isDarkMode;
        }
    }
})
export const darkModeActions = darkModeSlice.actions;
