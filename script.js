const puzzles = [
    [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
];


let sudokuGrid = JSON.parse(JSON.stringify(puzzles[0]));
const board = document.getElementById("sudokuBoard");
let startTime, timerInterval;

function createBoard() {
    board.innerHTML = "";
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let cell = document.createElement("input");
            cell.type = "text";
            cell.classList.add("cell");
            cell.value = sudokuGrid[row][col] === 0 ? "" : sudokuGrid[row][col];
            cell.readOnly = sudokuGrid[row][col] !== 0;
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("input", handleInput);
            board.appendChild(cell);
        }
    }
}

function handleInput(e) {
    let row = e.target.dataset.row;
    let col = e.target.dataset.col;
    let value = parseInt(e.target.value) || 0;
    if (value >= 1 && value <= 9) {
        sudokuGrid[row][col] = value;
    } else {
        e.target.value = "";
    }
}

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num ||
            board[3 * Math.floor(row / 3) + Math.floor(i / 3)]
            [3 * Math.floor(col / 3) + i % 3] === num) {
            return false;
        }
    }
    return true;
}

function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}
document.getElementById("solveBtn").addEventListener("click", () => {
    startTimer();
    if (solveSudoku(sudokuGrid)) {
        stopTimer();
        createBoard();
        alert(`Solved in ${Math.floor((Date.now() - startTime) / 1000)} seconds!`);
    } else {
        alert("No solution exists!");
    }
});

document.getElementById("hintBtn").addEventListener("click", () => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuGrid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(sudokuGrid, row, col, num)) {
                        sudokuGrid[row][col] = num;
                        createBoard();
                        return;
                    }
                }
            }
        }
    }
});

document.getElementById("newPuzzleBtn").addEventListener("click", () => {
    sudokuGrid = JSON.parse(JSON.stringify(puzzles[0]));
    createBoard();
});

document.getElementById("darkModeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timerDisplay").textContent = `Time: ${elapsedTime}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

createBoard();
