import { createSlice } from '@reduxjs/toolkit';

const blocksSlice = createSlice({
  name: 'blocks',
  initialState: [],
  reducers: {
    addBlock: (state, action) => {
      state.push(action.payload);
    },
    deleteBlock: (state, action) => {
      return state.filter(block => block.id !== action.payload);
    },
  },
});

export const { addBlock, deleteBlock } = blocksSlice.actions;
export default blocksSlice.reducer;