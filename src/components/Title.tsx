import * as React from 'react';

interface Props {
  text: string;
}

const Title: React.FC<Props> = ({ text }) => (
  <div className="title">
    <p>{text}</p>
  </div>
);

export default Title;
