import * as React from 'react';

interface Props {
  value: number;
}

const NumberDisplay: React.FC<Props> = ({ value }) => {
  const nonNegVal = value < 0 ? 0 : value;
  return <div className="number-display">{nonNegVal.toString().padStart(3, `0`)}</div>;
};

export default NumberDisplay;
