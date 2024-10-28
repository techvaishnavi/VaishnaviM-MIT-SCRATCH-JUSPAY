import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  repeat: {}, 
};

const repeatSlice = createSlice({
  name: 'repeat',
  initialState,
  reducers: {
    setRepeatEvents: (state, action) => {
      state.repeat = action.payload;
    },
  },
});

export const { setRepeatEvents } = repeatSlice.actions;
export default repeatSlice.reducer;
