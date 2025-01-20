import { configureStore } from "@reduxjs/toolkit";
import sidebar from "./sidebarSlice";
import tokenReducer from "./tokenSlice";
import searchbar from "./searchSlice";
import subscriptionReducer from "./subscriptionslice";

export const store = configureStore({
  reducer: {
    sidebar: sidebar,
    auth: tokenReducer,
    searchbar: searchbar,
    subscription: subscriptionReducer,
  },
});
