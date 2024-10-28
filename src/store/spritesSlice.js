
import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  {
    id: 1,
    x: 50,
    y: 200,
    rotation: 0,
    type: 'cat',
    direction: 1,
    initialX: 50,
    initialY: 200,
    message: "",
    triggerOnClick: null, 
    lastAction: null,     
  }
];

const spritesSlice = createSlice({
  name: 'sprites',
  initialState,
  reducers: {
    setTriggerOnClick: (state, action) => {
      const { id, actionType, actionValue } = action.payload;
      const index = state.findIndex((sprite) => sprite.id === id);
      if (index !== -1) {
        state[index].triggerOnClick = { actionType, actionValue };
        console.log("Updated triggerOnClick for Sprite ID:", id);
      }
    },
    setLastAction: (state, action) => {
      const { id, actionType, actionValue } = action.payload;
      const index = state.findIndex(sprite => sprite.id === id);
      if (index !== -1) {
        state[index].lastAction = { actionType, actionValue };
      }
    },
    updateSprite: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.findIndex(sprite => sprite.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...updates };
      }
    },
    addSprite: (state, action) => {
      state.push(action.payload);
    },
    deleteSprite: (state, action) => {
      return state.filter(sprite => sprite.id !== action.payload);
    },
    resetSprites: () => initialState,
  },
});

export const { setTriggerOnClick, setLastAction, updateSprite, addSprite, deleteSprite } = spritesSlice.actions;
export default spritesSlice.reducer;
