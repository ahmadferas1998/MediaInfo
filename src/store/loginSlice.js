import { createSlice } from "@reduxjs/toolkit";

const loginSlice= createSlice({
  name: "content",
  initialState: {
    content: {},
  },
  reducers: {
    setContent(state, action) {
      state.content = action.payload;
    },
  },
});
export const loginAction= loginSlice.actions
export default  loginSlice.reducer;