import { useState } from "react";
import "./styles.css";

function Square({ value, onSquareClick, isWinningSquare }) {
  const className = "square" + (isWinningSquare ? " winning" : "");
  const style = isWinningSquare ? { backgroundColor: "green" } : null;

  return (
    <button className={className} onClick={onSquareClick} style={style}>
      {value}
    </button>
  );
}
function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const result = calculateWinner(squares);
  const winner = result?.winner;
  const winline = result?.line;
  console.log(`currentMove###${currentMove}`)
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (currentMove === 9) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const totalRows = 3;
  const totalCols = 3;
  let board = [];
  for (let row = 0; row < totalRows; ++row) {
    let temp = [];
    for (let col = 0; col < totalCols; ++col) {
      const index = row * totalRows + col;
      temp.push(
        <Square
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinningSquare={winline?.includes(index)}
        />
      );
    }

    board.push(<div className="board-row">{temp}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const [isAscending, setIsAscending] = useState(true);
  const currentSquares = history[currentMove];
  const current = currentSquares.squares;

  function handlePlay(nextSquares, i) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, lastMove: i },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    let description;
    if (move === currentMove) {
      description = "You are at move #" + move;
      return <li key={move}>{description}</li>;
    }

    if (move > 0) {
      const row = Math.floor(step.lastMove / 3) + 1;
      const col = (step.lastMove % 3) + 1;
      description = `Go to move #${move} (${row}, ${col})`;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={current} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? "Sort descending" : "Sort ascending"}
        </button>
        <ol>{isAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
