import * as React from 'react';

const Instructions = () => (
  <div className="instructions">
    <div className="mouse-key">
      <p>Left click to uncover</p>
      <p>Right click to flag</p>
    </div>
    <div className="emoji-key">
      <p>
        <span role="img" aria-label="ongoing-emoji">
          🙂
        </span>
        {` - `}Keep Playing
      </p>
      <p>
        <span role="img" aria-label="won-emoji">
          😃
        </span>
        {` - `}You Won
      </p>
      <p>
        <span role="img" aria-label="lost-emoji">
          🙁
        </span>
        {` - `}You Lost
      </p>
    </div>
  </div>
);

export default Instructions;
