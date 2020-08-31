// Helper functions
const randomIntInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Types
interface MineLocations {
  [key: number]: number[];
}

export interface Square {
  row: number;
  col: number;
  type: `empty` | `mine`;
  adjacent: number;
  status: `covered` | `uncovered` | `flagged`;
}

export type Grid = Square[][];

export type GameStatus = `ongoing` | `won` | `lost`;

interface StatusCount {
  uncovered: {
    empty: number;
    mine: number;
  };
  flagged: {
    empty: number;
    mine: number;
  };
}

// Minesweeper utils
const generateMines = (gridSize: number, numberOfMines: number): MineLocations => {
  const mines: Set<number> = new Set();
  while (mines.size < numberOfMines) {
    mines.add(randomIntInRange(1, gridSize * gridSize));
  }
  const mineLocations: MineLocations = {};
  mines.forEach((value) => {
    const key = Math.ceil(value / gridSize) - 1;
    const val = (value - 1) % gridSize;
    if (Object.keys(mineLocations).includes(String(key))) {
      mineLocations[key].push(val);
    } else {
      const newArr = [val];
      mineLocations[key] = newArr;
    }
  });
  return mineLocations;
};

export const generateGrid = (gridSize: number, numberOfMines: number): Grid => {
  const mines = generateMines(gridSize, numberOfMines);
  const outerArray: Grid = [];
  for (let i = 0; i < gridSize; i++) {
    const innerArr: Square[] = [];
    for (let j = 0; j < gridSize; j++) {
      if (mines[i] && mines[i].includes(j)) {
        innerArr.push({ row: i, col: j, type: `mine`, adjacent: 0, status: `covered` });
      } else {
        innerArr.push({ row: i, col: j, type: `empty`, adjacent: 0, status: `covered` });
      }
    }
    outerArray.push(innerArr);
  }
  populateAdjacents(outerArray);
  return outerArray;
};

const getAdjacentSquares = (grid: Grid, i: number, j: number): Square[] => {
  const adjacent: Square[] = [];
  // previous row
  if (grid[i - 1]) {
    if (grid[i - 1][j - 1]) adjacent.push(grid[i - 1][j - 1]);
    adjacent.push(grid[i - 1][j]);
    if (grid[i - 1][j + 1]) adjacent.push(grid[i - 1][j + 1]);
  }
  // current row
  if (grid[i][j - 1]) adjacent.push(grid[i][j - 1]);
  if (grid[i][j + 1]) adjacent.push(grid[i][j + 1]);
  // next row
  if (grid[i + 1]) {
    if (grid[i + 1][j - 1]) adjacent.push(grid[i + 1][j - 1]);
    adjacent.push(grid[i + 1][j]);
    if (grid[i + 1][j + 1]) adjacent.push(grid[i + 1][j + 1]);
  }
  return adjacent;
};

const populateAdjacents = (grid: Grid): void => {
  grid.forEach((row, i) => {
    row.forEach((square, j) => {
      if (square.type === `empty`) {
        const adjacentSquares = getAdjacentSquares(grid, i, j);
        const mineSquares = adjacentSquares.filter((adjSq) => adjSq.type === `mine`);
        square.adjacent = mineSquares.length;
      }
    });
  });
};

const revealAllMines = (grid: Grid): Grid => {
  const newGrid = [...grid];
  newGrid.forEach((row) => {
    row.forEach((square) => {
      if (square.type === `mine`) {
        square.status = `uncovered`;
      }
    });
  });
  return newGrid;
};

export const statusCount = (grid: Grid): StatusCount => {
  let uncoveredEmpty = 0;
  let uncoveredMine = 0;
  let flaggedEmpty = 0;
  let flaggedMine = 0;
  grid.forEach((row) => {
    row.forEach((square) => {
      if (square.status === `uncovered` && square.type === `empty`) {
        uncoveredEmpty++;
      }
      if (square.status === `uncovered` && square.type === `mine`) {
        uncoveredMine++;
      }
      if (square.status === `flagged` && square.type === `empty`) {
        flaggedEmpty++;
      }
      if (square.status === `flagged` && square.type === `mine`) {
        flaggedMine++;
      }
    });
  });
  return {
    uncovered: {
      empty: uncoveredEmpty,
      mine: uncoveredMine,
    },
    flagged: {
      empty: flaggedEmpty,
      mine: flaggedMine,
    },
  };
};

export const getGameStatus = (grid: Grid, gridSize: number, numberOfMines: number): GameStatus => {
  const squareCount = gridSize * gridSize;
  const uncoveredCount = squareCount - numberOfMines;
  const sc = statusCount(grid);
  if (sc.uncovered.mine > 0) {
    return `lost`;
  }
  if (sc.uncovered.empty === uncoveredCount && sc.flagged.mine === numberOfMines) {
    return `won`;
  }
  return `ongoing`;
};

export const updateGrid = (grid: Grid, square: Square, clickType: string): Grid => {
  const newGrid = [...grid];
  if (clickType === `right`) {
    square.status = square.status === `covered` ? `flagged` : `covered`;
  } else {
    if (square.type === `mine`) {
      return revealAllMines(newGrid);
    }
    newGrid[square.row][square.col].status = `uncovered`;
    if (square.adjacent === 0) {
      uncoverAdjacents(newGrid, square);
    }
  }
  return newGrid;
};

const uncoverAdjacents = (grid: Grid, square: Square): void => {
  const adjacents = getAdjacentSquares(grid, square.row, square.col);
  const adjacentZeros = adjacents.filter(
    (el) => el.status === `covered` && el.type === `empty` && el.adjacent === 0
  );
  const adjacentEmpties = adjacents.filter((el) => el.status === `covered` && el.type === `empty`);
  adjacentEmpties.forEach((sq) => (grid[sq.row][sq.col].status = `uncovered`));
  if (adjacentZeros.length < 1) return;
  adjacentZeros.forEach((sq) => {
    sq.status = `uncovered`;
    uncoverAdjacents(grid, sq);
  });
};
