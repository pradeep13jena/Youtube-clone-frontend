import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("jwtToken") || null,
};

const tokenSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("jwtToken", action.payload); // Persist token
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("jwtToken"); // Clear token
    },
  },
});

export const { login, logout } = tokenSlice.actions;

export const selectAuth = (state) => state.auth;

export default tokenSlice.reducer;
