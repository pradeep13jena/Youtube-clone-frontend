import { createSlice } from "@reduxjs/toolkit";
import reducer from "./tokenSlice";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptionList: false,
  },
  reducers: {
    render: (state, action) => {
      state.subscriptionList = !state.subscriptionList;
    },
  },
});

export const { render } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
