import { createSlice } from '@reduxjs/toolkit';

const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    selectedSpriteId: null,
  },
  reducers: {
    selectSprite: (state, action) => {
      state.selectedSpriteId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedSpriteId = null;
    },
  },
});

export const { selectSprite, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
