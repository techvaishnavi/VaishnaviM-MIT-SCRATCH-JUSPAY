// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Sidebar from './components/Sidebar';
import MidArea from './components/MidArea';
import PreviewArea from './components/PreviewArea';

export default function App() {
  return (
    <Provider store={store}>
      <div className="bg-white pt-6 font-sans h-screen flex flex-row">
        <Sidebar />
        <MidArea />
        <div className="w-2/5 h-full overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea />
        </div>
      </div>
    </Provider>
  );
}
