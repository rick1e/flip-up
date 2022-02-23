import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const gridSize = 3
  const generateArray = (size, value) => {
    let array = []
    for (let i = 0; i < size * size; i++) {
      array.push(value)
    }
    return array
  }
  const [board, setBoard] = useState(generateArray(gridSize, 1));
  const [timer, setTimer] = useState(0.00);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState("OFF")

  const onRadioValueChange = (event) => {
    setAiDifficulty(event.target.value)
  }

  const getCellStyle = (value) => {
    let columns = gridSize === 4 ? "quarter" : "third"
    return value === 0 ? "cell " + columns : "cell blue " + columns
  }

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

    if (isGameRunning) {
      const cell = document.getElementById(index)
      let newBoard = board;
      newBoard[index] = (newBoard[index] + 1) % 2
      cell.className = getCellStyle(newBoard[index])
      setBoard(newBoard)

      if (checkComplete(newBoard)) {
        endGame()
      }
    }


  }
  const drawBoard = () => {
    const boardDivs = board.map((cell, index) => {
      let cellStyle = getCellStyle(cell)
      return <div key={index} id={index} className={cellStyle} onClick={() => { flip(index) }}></div>
    })

    return boardDivs;
  }

  const getStartIndicies = (size) => {
    let indexList = []
    while (indexList.length < size - gridSize) {
      let possibleIndex = Math.floor(Math.random() * size)
      if (!indexList.includes(possibleIndex)) {
        indexList.push(possibleIndex)
      }
    }

    return indexList
  }

  const startGame = () => {
    setTimer(0.00)
    setIsGameRunning(true)
    const startButton = document.getElementById("startButton")
    document.getElementById("winnerBanner").innerHTML = ""
    startButton.disabled = true;
    let startInicies = getStartIndicies(board.length)
    let newBoard = board

    //console.log(startInicies)

    for (let index = 0; index < startInicies.length; index++) {
      const cell = document.getElementById(startInicies[index])
      newBoard[startInicies[index]] = (newBoard[startInicies[index]] + 1) % 2
      cell.className = getCellStyle(newBoard[startInicies[index]])
      setBoard(newBoard)
    }




  }

  useEffect(() => {
    if (isGameRunning) {
      if (aiDifficulty === "OFF") {
        return
      }
      if (aiDifficulty === "EASY") {
        let count = 0
        let AI = setInterval(() => {
          let index = Math.floor(Math.random() * board.length)
          if (checkComplete(board)) {
            clearInterval(AI)
            endGame()
            return
          }
          flip(index)
          console.log(count++)
        }, 200)
        return
      }

      if (aiDifficulty === "HARD") {
        let count = 0
        let AI = setInterval(() => {
          let blueIndices = []
          board.filter((cell, index) => {
            if (cell === 1) {
              blueIndices.push(index)
            }
          });
          let blueIndex = Math.floor(Math.random() * blueIndices.length)
          if (checkComplete(board)) {
            clearInterval(AI)
            endGame()
            return
          }
          if (blueIndices.length > 0) {
            flip(blueIndices[blueIndex])
          }
          console.log(blueIndices)
        }, 200)
        return
      }

    }
  }, [isGameRunning])


  useEffect(() => {
    if (isGameRunning) {
      const timeJump = 20
      const timerTimeout = setTimeout(() => {
        let time = Number.parseFloat((timer + (timeJump / 1000)).toFixed(2))
        //console.log(timer)
        //console.log(time)
        setTimer(time);
      }, timeJump);
    }
  })


  return (
    <div className="App">
      <h1> Flip Up Timed Attack </h1>
      <h1> Turn all the tiles BLUE </h1>
      <span id="timeBanner">{timer.toFixed(2)}</span><br />
      <span id="winnerBanner"></span>
      <div id="board" className={gridSize === 4 ? "quarter" : "third"}>
        {drawBoard()}
      </div>

      <h2> AI Difficulty : {aiDifficulty}</h2>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="OFF"
            checked={aiDifficulty === "OFF"}
            onChange={onRadioValueChange}
            disabled={isGameRunning}
          />
          OFF
          </label>
      </div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="EASY"
            checked={aiDifficulty === "EASY"}
            onChange={onRadioValueChange}
            disabled={isGameRunning}
          />
          EASY
          </label>
      </div>
      <div className="radio">
        <label>
          <input
            type="radio"
            value="HARD"
            checked={aiDifficulty === "HARD"}
            onChange={onRadioValueChange}
            disabled={isGameRunning}
          />
          HARD
          </label>
      </div>

      <button id="startButton" onClick={startGame}>
        Start
      </button>


    </div>
  );
}

export default App;
