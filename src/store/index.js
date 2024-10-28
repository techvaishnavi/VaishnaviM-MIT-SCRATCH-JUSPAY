import { configureStore } from '@reduxjs/toolkit';
import spritesReducer from './spritesSlice';
import blocksReducer from './blocksSlice';
import animationReducer from './animationSlice';
import collisionReducer from './collisionSlice';
import selectionReducer from './selectionSlice';
import settingsReducer from './settingsSlice';
import undoable from 'redux-undo';

const store = configureStore({
  reducer: {
    sprites: undoable(spritesReducer),
    blocks: undoable(blocksReducer),
    animation: animationReducer,
    selection: selectionReducer,
    settings: settingsReducer,
    collision: collisionReducer,
  },
});

export default store;
