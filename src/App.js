// App component is the main entry point fo the Emoji Search app
import React, { useState } from 'react';
import EmojiSearch from './components/EmojiSearch'; // Import the EmojiSearch component
import './App.css';

const App = () => {
  // State to manage the search query entered by the user
  const [searchQuery, setSearchQuery] = useState('');
  // API key for accessing emoji data, see if API supports Token based authentication or use Env variables to hide the key
  const apiKey = '84fac0f20066123921007d0d48bac464759a4647';

  return (
    //Render the main application container with a title and EmojiSearch component
    <div className="App">
      <h1>Emoji Search</h1>
      <EmojiSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} apiKey={apiKey} />
    </div>
  );
};

export default App;
