import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isVisible: true,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isVisible = !state.isVisible;
    },
  },
});

export const { toggleSidebar, showSidebar, hideSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
