import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    gridVisible: true,
    animationSpeed: 1.0,
  },
  reducers: {
    toggleGrid: (state) => {
      state.gridVisible = !state.gridVisible;
    },
    setAnimationSpeed: (state, action) => {
      state.animationSpeed = action.payload;
    },
  },
});

export const { toggleGrid, setAnimationSpeed } = settingsSlice.actions;
export default settingsSlice.reducer;
