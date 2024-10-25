import { useState, useEffect } from "react";
import "./App.css";

// function to check if there's a winner
const checkWinner = (board: Array<string | null>) => {
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of combos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // return the winner
    }
  }
  return null; // no winner
};

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null)); // game board state
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // state for player's turn
  const [gameOver, setGameOver] = useState(false); // state for game status
  const [winner, setWinner] = useState<string | null>(null); // state to store the winner

  // runs every time the board or turn changes, checks for a winner or a draw
  useEffect(() => {
    const gameWinner = checkWinner(board);
    if (gameWinner) {
      setWinner(gameWinner); // set the winner if there's one
      setGameOver(true); // game is over if there's a winner
    } else if (board.every((square) => square !== null)) {
      setGameOver(true); // game is over if all squares are filled
    } else if (!isPlayerTurn && !gameOver) {
      computerPlay([...board]); // trigger the computer's move if it's the computer's turn
    }
  }, [board, isPlayerTurn, gameOver]);

  // function for handling player click on the board
  const handleClick = (index: number) => {
    if (board[index] || gameOver) return; // prevent click if square is filled or game is over

    const newBoard = [...board];
    newBoard[index] = isPlayerTurn ? "🩵" : "🩷"; // player's or computer's symbol
    setBoard(newBoard); // update the board
    setIsPlayerTurn(!isPlayerTurn); // switch turns
  };

  // function for computer's move using minimax algorithm
  const minimax = (
    newBoard: Array<string | null>,
    depth: number,
    isMaximizing: boolean
  ): number => {
    const gameWinner = checkWinner(newBoard);
    if (gameWinner === "🩷") return 10 - depth; // computer wins
    if (gameWinner === "🩵") return depth - 10; // player wins
    if (newBoard.every((square) => square !== null)) return 0; // draw

    if (isMaximizing) {
      let bestScore = -Infinity;
      newBoard.forEach((value, idx) => {
        if (!value) {
          newBoard[idx] = "🩷"; // computer move
          let score = minimax(newBoard, depth + 1, false);
          newBoard[idx] = null;
          bestScore = Math.max(score, bestScore);
        }
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      newBoard.forEach((value, idx) => {
        if (!value) {
          newBoard[idx] = "🩵"; // player move
          let score = minimax(newBoard, depth + 1, true);
          newBoard[idx] = null;
          bestScore = Math.min(score, bestScore);
        }
      });
      return bestScore;
    }
  };

  // function for computer play, called after player's turn
  const computerPlay = (newBoard: Array<string | null>) => {
    setTimeout(() => {
      let bestMove;
      let bestScore = -Infinity;
      newBoard.forEach((value, idx) => {
        if (!value) {
          newBoard[idx] = "🩷"; // computer move
          let score = minimax(newBoard, 0, false);
          newBoard[idx] = null;
          if (score > bestScore) {
            bestScore = score;
            bestMove = idx;
          }
        }
      });
      if (bestMove !== undefined) {
        newBoard[bestMove] = "🩷"; // computer makes the move
        setBoard(newBoard); // update board
        setIsPlayerTurn(true); // switch back to player
      }
    }, 500); // delay before the computer move
  };

  // function to restart the game and reset the board
  const resetGame = () => {
    setBoard(Array(9).fill(null)); // reset board
    setIsPlayerTurn(true); // player starts
    setGameOver(false); // reset game status
    setWinner(null); // reset winner state
  };

  // game status message
  const status = winner
    ? `Winner: ${winner}`
    : gameOver
    ? "Draw!"
    : `Next player: ${isPlayerTurn ? "🩵" : "🩷"}`;

  return (
    <div className="wrapper">
      <div className="container">
        <h1>Tic Tac Toe</h1>
        <div className="board">
          {board.map((value, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="square"
            >
              {value}
            </button>
          ))}
        </div>
        <button onClick={resetGame} className="resetButton">
          Reset
        </button>
        <h2>{status}</h2>
      </div>
    </div>
  );
}

export default TicTacToe;
