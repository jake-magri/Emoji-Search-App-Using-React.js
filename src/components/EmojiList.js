// EmojiList component displays a list of emojis and related information
import React from 'react';

const EmojiList = ({ emojis, displayedEmojis, displayCount, handleShowMore, handleShowLess, error }) => {
  return (
    <div>
      {/* Display information about the number of emojis being shown */}
      <p className="emoji-info">
        Displaying {Math.min(displayCount, emojis.length)} of {emojis.length} emojis{' '}
      </p>

      {/* Check for errors and display an error message if present */}
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        // Display the list of emojis
        <ul className="emoji-list">
          {displayedEmojis.map((emoji) => (
            <li key={emoji.slug}>
              <span>Emoji: </span>
              <span>{emoji.character}</span>
              <span> Name: </span>
              <span>{emoji.unicodeName}</span>
            </li>
          ))}
        </ul>
      )}
      {/* Container for buttons to show more or fewer emojis */}
      <p className="button-container">
        <button onClick={handleShowMore}>Show More</button>{' '}
        <button onClick={handleShowLess}>Show Less</button>
      </p>
    </div>
  );
};

export default EmojiList;
