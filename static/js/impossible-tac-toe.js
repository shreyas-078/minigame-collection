const PLAYER = 'X';
const COMPUTER = 'O';
const EMPTY = '';
const board = Array(9).fill(EMPTY);

const cells = document.querySelectorAll('.cell');
const drawsCounterElement = document.getElementById('draws-counter');
const codePrompt = document.getElementById('code-prompt');
const codeInput = document.getElementById('code-input');
const codeSubmit = document.getElementById('code-submit');
const codeMessage = document.getElementById('code-message');
const newGameButton = document.getElementById('new-game');

let drawsOrLosses = 0;

const checkWinner = (board) => {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const [a, b, c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every(cell => cell !== EMPTY)) {
    return 'Draw';
  }

  return null;
};

const availableMoves = (board) => {
  return board.map((cell, index) => cell === EMPTY ? index : -1).filter(index => index !== -1);
};

const minimax = (board, isMaximizing) => {
  const winner = checkWinner(board);
  if (winner === COMPUTER) return 1;
  if (winner === PLAYER) return -1;
  if (winner === 'Draw') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves(board)) {
      board[move] = COMPUTER;
      const score = minimax(board, false);
      board[move] = EMPTY;
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves(board)) {
      board[move] = PLAYER;
      const score = minimax(board, true);
      board[move] = EMPTY;
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
};

const bestMove = (board) => {
  let move;
  let bestScore = -Infinity;
  for (const availableMove of availableMoves(board)) {
    board[availableMove] = COMPUTER;
    const score = minimax(board, false);
    board[availableMove] = EMPTY;
    if (score > bestScore) {
      bestScore = score;
      move = availableMove;
    }
  }
  return move;
};

const handleClick = (event) => {
  const index = event.target.dataset.index;
  if (board[index] === EMPTY) {
    board[index] = PLAYER;
    event.target.textContent = PLAYER;
    const winner = checkWinner(board);
    if (winner) {
      setTimeout(() => {
        if (winner === 'Draw') {
          drawsOrLosses++;
          drawsCounterElement.textContent = drawsOrLosses;
          if (drawsOrLosses >= 15) {
            codePrompt.style.display = 'block';
          }
          alert("It's a draw!");
        } else {
          alert(`${winner} wins!`);
          drawsOrLosses++;
          drawsCounterElement.textContent = drawsOrLosses;
          if (drawsOrLosses >= 15) {
            codePrompt.style.display = 'block';
          }
        }
        resetBoard();
      }, 100);
      return;
    }

    const move = bestMove(board);
    if (move !== undefined) {
      board[move] = COMPUTER;
      cells[move].textContent = COMPUTER;
      const winner = checkWinner(board);
      if (winner) {
        setTimeout(() => {
          if (winner === 'Draw') {
            drawsOrLosses++;
            drawsCounterElement.textContent = drawsOrLosses;
            if (drawsOrLosses >= 15) {
              codePrompt.style.display = 'block';
            }
            alert("It's a draw!");
          } else {
            alert(`${winner} wins!`);
            drawsOrLosses++;
            drawsCounterElement.textContent = drawsOrLosses;
            if (drawsOrLosses >= 15) {
              codePrompt.style.display = 'block';
            }
          }
          resetBoard();
        }, 100);
      }
    }
  }
};

const handleCodeSubmit = () => {
  if (codeInput.value === 'dinosaur') {
    codeMessage.textContent = 'Success!';
    codeMessage.style.color = 'green';
  } else {
    codeMessage.textContent = 'Incorrect code. Try again.';
    codeMessage.style.color = 'red';
  }
};

const resetBoard = () => {
  board.fill(EMPTY);
  cells.forEach(cell => cell.textContent = EMPTY);
  // Optionally, you might want to make the computer play first again after resetting
  const initialMove = bestMove(board);
  if (initialMove !== undefined) {
    board[initialMove] = COMPUTER;
    cells[initialMove].textContent = COMPUTER;
  }
};

cells.forEach(cell => cell.addEventListener('click', handleClick));
codeSubmit.addEventListener('click', handleCodeSubmit);
newGameButton.addEventListener('click', resetBoard);

// Initial move by computer
const initialMove = bestMove(board);
if (initialMove !== undefined) {
  board[initialMove] = COMPUTER;
  cells[initialMove].textContent = COMPUTER;
}
