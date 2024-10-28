// src/store/animationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const animationSlice = createSlice({
  name: 'animation',
  initialState: {
    isAnimating: false,
  },
  reducers: {
    startAnimation: (state) => {
      state.isAnimating = true;
    },
    stopAnimation: (state) => {
      state.isAnimating = false;
    },
  },
});

export const { startAnimation, stopAnimation } = animationSlice.actions;
export default animationSlice.reducer;
