import React, { useState } from 'react';
import EmojiSearch from './components/EmojiSearch';
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="App">
      <h1>Emoji Search</h1>
      <EmojiSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
};

export default App;
