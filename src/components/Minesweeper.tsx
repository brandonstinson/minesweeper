import * as React from 'react';
import { useEffect, useState } from 'react';
import flagIcon from '../flag.png';
import mineIcon from '../mine.svg';
import {
  GameStatus,
  generateGrid,
  getGameStatus,
  Grid,
  Square,
  statusCount,
  updateGrid,
} from '../utils';
import NumberDisplay from './NumberDisplay';

enum colorMap {
  /*eslint-disable */
  'blue' = 1,
  'green',
  'red',
  'purple',
  'maroon',
  'turquoise',
  'black',
  'gray',
  /*eslint-enable */
}

const gameStatusMap = {
  ongoing: `🙂`,
  won: `😃`,
  lost: `🙁`,
};

const Minesweeper: React.FC = () => {
  const GRID_SIZE = 16;
  const NUMBER_OF_MINES = 40;

  const displaySquare = (square: Square): JSX.Element => {
    const { status, type, adjacent, row, col } = square;
    if (status !== `uncovered`) {
      return (
        <button
          key={`${row}-${col}`}
          onClick={(e) => {
            e.preventDefault();
            handleClick(square);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleRightClick(square);
          }}
          disabled={gameStatus !== `ongoing`}
          style={{ backgroundColor: `#eceff4`, border: `4px outset #d8dee9` }}>
          {status === `flagged` ? <img src={flagIcon} alt="red flag" /> : null}
        </button>
      );
    }
    return (
      <button
        key={`${row}-${col}`}
        style={{ backgroundColor: `#d8dee9`, color: colorMap[adjacent], fontWeight: 900 }}
        disabled>
        {type === `mine` ? <img src={mineIcon} alt="mine" /> : adjacent === 0 ? `` : adjacent}
      </button>
    );
  };

  const newGame = (): void => {
    setGrid(generateGrid(GRID_SIZE, NUMBER_OF_MINES));
    setRemainingMines(NUMBER_OF_MINES);
  };

  const handleClick = (square: Square): void => {
    setGrid(updateGrid(grid, square, `left`));
  };

  const handleRightClick = (square: Square): void => {
    setGrid(updateGrid(grid, square, `right`));
  };

  const [grid, setGrid] = useState<Grid>(generateGrid(GRID_SIZE, NUMBER_OF_MINES));
  const [remainingMines, setRemainingMines] = useState<number>(NUMBER_OF_MINES);
  const [gameStatus, setGameStatus] = useState<GameStatus>(`ongoing`);

  useEffect(() => {
    const sc = statusCount(grid);
    setRemainingMines(NUMBER_OF_MINES - sc.flagged.empty - sc.flagged.mine);
    setGameStatus(getGameStatus(grid, GRID_SIZE, NUMBER_OF_MINES));
  }, [grid]);

  useEffect(() => {
    if (gameStatus === `lost`) {
      setRemainingMines(0);
    }
  }, [gameStatus]);

  return (
    <div className="main">
      <div className="main-container border-outset">
        <div className="control-and-display border-inset">
          <NumberDisplay value={remainingMines} />
          <button className="border-outset" onClick={newGame}>
            <span role="img" aria-label="smile" className="face">
              {gameStatusMap[gameStatus]}
            </span>
          </button>
          <NumberDisplay value={0} />
        </div>
        <div className="minefield border-inset">
          {grid.map((row) => row.map((square) => displaySquare(square)))}
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;
