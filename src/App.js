import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [board, setBoard] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [timer, setTimer] = useState(0.01);
  const [isGameRunning, setIsGameRunning] = useState(false);

  const endGame = () => {

    let result = board.reduce((total, cell) => {
      return total + cell
    }, 0)
    let resultText = result === 0 ? "LOST" : "WON"
    document.getElementById("winnerBanner").innerHTML = "YOU " + resultText + "!!!"
    const startButton = document.getElementById("startButton")
    startButton.disabled = false;
    setIsGameRunning(false)
  }

  const checkComplete = (board) => {
    let result = board.reduce((total, cell) => {
      return total + cell
    }, 0)
    return result === board.length
  }

  const flip = (index) => {

    const cell = document.getElementById(index)
    let newBoard = board;
    newBoard[index] = (newBoard[index] + 1) % 2
    cell.className = newBoard[index] === 0 ? "cell" : "cell blue"
    setBoard(newBoard)

    if (checkComplete(newBoard)) {
      endGame()
    }


  }
  const drawBoard = () => {
    const boardDivs = board.map((cell, index) => {
      let cellStyle = cell === 0 ? "cell" : "cell blue"
      return <div key={index} id={index} className={cellStyle} onClick={() => { flip(index) }}></div>
    })

    return boardDivs;
  }

  const getStartIndicies = (size) => {
    let indexList = []
    while (indexList.length < size / 2 - 1) {
      let possibleIndex = Math.floor(Math.random() * size)
      if (!indexList.includes(possibleIndex)) {
        indexList.push(possibleIndex)
      }
    }

    return indexList
  }

  const startGame = () => {
    let count = 0
    setTimer(0.01)
    setIsGameRunning(true)
    const startButton = document.getElementById("startButton")
    document.getElementById("winnerBanner").innerHTML = ""
    startButton.disabled = true;
    let startInicies = getStartIndicies(board.length)
    let newBoard = board

    console.log(startInicies)

    for (let index = 0; index < startInicies.length; index++) {
      const cell = document.getElementById(startInicies[index])
      newBoard[startInicies[index]] = (newBoard[startInicies[index]] + 1) % 2
      cell.className = newBoard[startInicies[index]] === 0 ? "cell" : "cell blue"
      setBoard(newBoard)
    }

    /*
    let AI = setInterval(() => {
      let index = Math.floor(Math.random() * board.length)
      if (checkComplete()) {
        clearInterval(AI)
        endGame()
        return
      }
      flip(index)
      console.log(count++)
    }, 250)
    */

  }


  useEffect(() => {
    if (isGameRunning) {
      const timeJump = 20
      const timerTimeout = setTimeout(() => {
        let time = Number.parseFloat((timer + (timeJump / 1000)).toFixed(2))
        console.log(timer)
        console.log(time)
        setTimer(time);
      }, timeJump);
    }
  })


  return (
    <div className="App">
      <h1> Turn all the tiles BLUE </h1>
      <span id="timeBanner">{timer}</span><br />
      <span id="winnerBanner"></span>
      <div id="board">
        {drawBoard()}
      </div>
      <button id="startButton" onClick={startGame}>
        Start
      </button>


    </div>
  );
}

export default App;
