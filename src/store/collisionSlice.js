import { createSlice } from '@reduxjs/toolkit';

const collisionSlice = createSlice({
  name: 'collision',
  initialState: {
    collisions: [],
  },
  reducers: {
    addCollision: (state, action) => {
      state.collisions.push(action.payload);
    },
    clearCollisions: (state) => {
      state.collisions = [];
    },
  },
});

export const { addCollision, clearCollisions } = collisionSlice.actions;
export default collisionSlice.reducer;
