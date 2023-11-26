import React, { useState } from 'react';
import EmojiSearch from './components/EmojiSearch';
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const apiKey = '84fac0f20066123921007d0d48bac464759a4647';

  return (
    <div className="App">
      <h1>Emoji Search</h1>
      <EmojiSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} apiKey={apiKey} />
    </div>
  );
};

export default App;
