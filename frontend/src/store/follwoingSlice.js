import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  following: [], // Stores users you follow
};

const followingSlice = createSlice({
  name: "following",
  initialState,
  reducers: {
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    addFollowing: (state, action) => {
      state.following.push(action.payload);
    },
    removeFollowing: (state, action) => {
      state.following = state.following.filter(user => user._id !== action.payload);
    },
  },
});

export const { setFollowing, addFollowing, removeFollowing } = followingSlice.actions;
export default followingSlice.reducer;
