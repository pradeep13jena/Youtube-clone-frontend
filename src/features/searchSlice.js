import { createSlice } from "@reduxjs/toolkit";

const searchBarSlice = createSlice({
  name: "searchbar",
  initialState: {
    text: "",
  },
  reducers: {
    updateText: (state, action) => {
      state.text = action.payload; // Update text from the action payload
    },
  },
});

// Export the action to update the search bar text
export const { updateText } = searchBarSlice.actions;

// Export the reducer to be added to the store
export default searchBarSlice.reducer;
