// components/EmojiList.js
import React from 'react';

const EmojiList = ({ emojis, displayedEmojis, displayCount, handleShowMore, handleShowLess, error }) => {
  return (
    <div>
      <p className="emoji-info">
        Displaying {Math.min(displayCount, emojis.length)} of {emojis.length} emojis{' '}
      </p>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
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
      <p className="button-container">
        <button onClick={handleShowMore}>Show More</button>{' '}
        <button onClick={handleShowLess}>Show Less</button>
      </p>
    </div>
  );
};

export default EmojiList;
