const startGameBtn = document.querySelector('#start-game-btn')
const restartGameBtn = document.querySelector('#restart-game-btn')
const gameBoardEl = document.querySelector('#gameboard')
const player1 = document.querySelector('#player1')
const player2 = document.querySelector('#player2')
const displayMessage = document.querySelector('#message')

const createPlayer = (name, mark) => {
    return {
        name, 
        mark
    }
}

const Gameboard = (() => {
    const gameBoard = ['', '', '', '', '', '', '', '', ''];

    const getGameBoard = () => {
        return gameBoard;
    }

    const clearGameBoard = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = '';
        }
    }

    const render = () => {
        let boardHTML = '';
        gameBoard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        })
        gameBoardEl.innerHTML = boardHTML;
        Game.attachListenersToRenderedSquares();
    }

    const updateSquareContent = (clickedSquareIndex, value) => {
        if (gameBoard[clickedSquareIndex] !== '') { return; } // prevents changing the sign in the used square
        gameBoard[clickedSquareIndex] = value;
    }

    return {        
        getGameBoard,
        clearGameBoard,
        render,
        updateSquareContent
    }
})()

const Game = (() => {
    let players = [];
    let curPlayerIndex;
    let gameOver;
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const updatePlayerTurn = () => {
        curPlayerIndex = curPlayerIndex === 0 ? 1 : 0;
    }

    const start = () => {
        players = [
            createPlayer(player1.value, 'X'),
            createPlayer(player2.vaue, 'O')
        ]
        curPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
    }
    
    const restart = () => {
        Gameboard.clearGameBoard();
        displayMessage.innerHTML = ''; // module messages
        Game.start();
    }

    const attachListenersToRenderedSquares = () => {
        const squares = document.querySelectorAll('.square')
        squares.forEach((square) => {
            square.addEventListener('click', squareClickHandler);
        })
    }

    const squareClickHandler = (event) => {
        if (gameOver) {
            return;
        }

        let clickedSquareIndex = parseInt(event.target.id.split("-")[1]);
        Gameboard.updateSquareContent(clickedSquareIndex, players[curPlayerIndex].mark);

        if (checkForWin(Gameboard.getGameBoard())) {
            displayMessage.innerHTML = `${players[curPlayerIndex].nam} won`; // module messages
        } else if (checkForTie(Gameboard.getGameBoard())) {
            displayMessage.innerHTML = 'It is a tie'; // module messages
        }

        updatePlayerTurn();
        Gameboard.render();
    }

    const checkForWin = (gameBoard) => {
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (gameBoard[a] && gameBoard[a] == gameBoard[b] && gameBoard[a] == gameBoard[c]) {
                gameOver = true;
                return true;
            }
        }
        return false;
    }

    const checkForTie = (gameBoard) => {
        return gameBoard.every(square => square !== '');
    }

    return {
        start,
        restart,
        attachListenersToRenderedSquares
    }
})()

startGameBtn.addEventListener('click', () => {
    Game.start();
});

restartGameBtn.addEventListener('click', () => {
    Game.restart();
});