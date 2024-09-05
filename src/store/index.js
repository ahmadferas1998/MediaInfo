import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";

const store = configureStore({
  reducer: {
    content: loginSlice,
  },
});

export default store;