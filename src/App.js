import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const generateArray = (size, value) => {
    let array = []
    for (let i = 0; i < size * size; i++) {
      array.push(value)
    }
    return array
  }
  const randomizeBoard = (size, max) => {

    let array = []
    for (let i = 0; i < size * size; i++) {
      let value = Math.floor(Math.random() * max)
      array.push(value)
    }
    return array

  }
  const [gridSize, setGridSize] = useState(3)
  const [board, setBoard] = useState(generateArray(gridSize, 1));
  const [targetBoard, setTargetBoard] = useState(randomizeBoard(gridSize, 3));
  const [flipPattern, setFlipPattern] = useState([
    0, 1, 0,
    1, 0, 1,
    0, 1, 0,]);
  const [timer, setTimer] = useState(0.00);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isCleared, setIsCleared] = useState(true);
  const [aiDifficulty, setAiDifficulty] = useState("OFF")
  const [aiSpeed, setAiSpeed] = useState(500)
  const [instructions, setInstructions] = useState("Tap a tile in your grid to start")


  const onGridChange = (event) => {
    setGridSize(Number.parseInt(event.target.value))
  }

  const onSpeedChange = (event) => {
    setAiSpeed(Number.parseInt(event.target.value))
  }
  const onRadioValueChange = (event) => {
    setAiDifficulty(event.target.value)
  }

  const getCellStyle = (value) => {
    let columns = gridSize === 4 ? "quarter" : "third"
    let cellStyle = "cell " + columns
    let colour = ""
    switch (value) {
      case 0:
        colour = "red"
        break;
      case 1:
        colour = "blue"
        break;
      case 2:
        colour = "yellow"
        break;
    }
    return "cell " + columns + " " + colour
  }



  const endGame = () => {

    let result = board.reduce((total, cell) => {
      return total + cell
    }, 0)
    let resultText = result === 0 ? "LOST" : "WON"
    document.getElementById("winnerBanner").innerHTML = "YOU " + resultText + "!!!"
    setIsGameRunning(false)
  }

  const checkComplete = (board) => {

    let result = board.reduce((allSame, cell, index) => {
      return allSame && cell === targetBoard[index]
    }, true)
    return result
  }

  // x = 0  Shift Left
  // x = 1  Shift Right

  const shiftHorizontal = (oldgrid, y) => {
    const horz = y * 2
    const grid = [...oldgrid]

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        let cell = Math.abs(horz - i) + j * 3;
        if (i == 2) {
          grid[cell] = 0
          break;
        }
        grid[cell] = grid[cell + 1 - horz]
      }
    }

    return grid
  }

  // x = 0  Shift Up
  // x = 1  Shift Down

  const shiftVertical = (oldgrid, x) => {

    const grid = [...oldgrid]
    const vert = 2 * x;

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        let cell = (Math.abs(vert - i) * 3) + j;
        if (i == 2) {
          grid[cell] = 0
          break;
        }
        grid[cell] = grid[cell + (1 - vert) * 3]
      }
    }
    return grid
  }

  const getIndexListFromFlip = (index, pattern) => {

    let test = [...pattern]

    if (index % 3 == 0) {
      test = [...shiftHorizontal(test, 0)]
    }
    if (index % 3 == 2) {
      test = [...shiftHorizontal(test, 1)]
    }
    if (Math.floor(index / 3) == 0) {
      test = [...shiftVertical(test, 0)]
    }
    if (Math.floor(index / 3) == 2) {
      test = [...shiftVertical(test, 1)]
    }

    const indexDem = test.reduce((set, value, valIndex) => {
      if (value == 1) {
        return [...set, valIndex]
      }
      return set
    }, [])

    return indexDem;
  }

  const flip = (index, user) => {

    if (checkComplete(board)) {
      startGame();
      setInstructions("Tap a tile in your grid to start")
      setIsCleared(true)
      return;
    }
    if (!isGameRunning) {
      setIsGameRunning(true)
      setIsCleared(false)
    }

    const pattern = flipPattern;

    let indices = getIndexListFromFlip(index, pattern)
    let newBoard = [...board];


    for (const i in indices) {
      const flipIndex = indices[i]
      const cell = document.getElementById(flipIndex)
      newBoard[flipIndex] = user === 2 ? user : (newBoard[flipIndex] + 1) % 3
      cell.className = getCellStyle(newBoard[flipIndex])
    }

    setBoard(newBoard)

    if (checkComplete(newBoard)) {
      endGame()
      setInstructions("Tap a tile in your grid to reset")
    }
  }


  const drawBoard = (thisBoard, idPrefix) => {
    const boardDivs = thisBoard.map((cell, index) => {
      let cellStyle = getCellStyle(cell)
      return <div key={index} id={idPrefix + index} className={cellStyle} onClick={idPrefix == '' ? () => { flip(index, 1) } : null}></div>
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
    document.getElementById("winnerBanner").innerHTML = ""
    let startInicies = getStartIndicies(board.length)
    let newBoard = generateArray(gridSize, 1)
    setBoard(newBoard)
  }

  const rollTraget = () => {
    if (isCleared) {
      setTargetBoard(randomizeBoard(gridSize, 3))
    }
  }

  /*
  useEffect(() => {
    let AI
    if (isGameRunning) {
      if (aiDifficulty === "OFF") {
        return
      }
      if (aiDifficulty === "EASY") {
        let count = 0
        AI = setInterval(() => {
          let index = Math.floor(Math.random() * board.length)
          console.log(board)
          console.log(timer)

          if (checkComplete(board)) {
            console.log("AI CLEAR intervals", AI, timer)
            clearInterval(AI)
            endGame()
            return
          }
          flip(index, 0)
          console.log("Game playing with intervals", AI, timer)
        }, aiSpeed)
        return
      }

      if (aiDifficulty === "HARD") {
        let count = 0
        AI = setInterval(() => {
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
            flip(blueIndices[blueIndex], 0)
          }
          console.log(blueIndices)
        }, aiSpeed)
        return
      }

    }
    else {
      console.log("Game done and clearing intervals", AI)
      clearInterval(AI)
    }
  }, [isGameRunning])
  */

  useEffect(() => {
    setBoard(generateArray(gridSize, 1))
  }, [gridSize])


  useEffect(() => {
    if (isGameRunning) {
      const timeJump = 20
      const timerTimeout = setTimeout(() => {
        let time = Number.parseFloat((timer + (timeJump / 1000)).toFixed(2))
        setTimer(time);
      }, timeJump);
    }
  })


  return (
    <div className="App">
      <h1> Flip Up SO.v1. </h1>
      <h1 > {instructions} </h1>
      <span id="timeBanner">{timer.toFixed(2)}</span><br />
      <span >Make your grid look like this</span><br />
      {isCleared ? <span >Tap to change</span> : null}
      <div id="rules">
        <div id="targetBoard" className={gridSize === 4 ? "quarter flip" : "third flip"} onClick={() => { }}>
          {drawBoard(flipPattern, 'flip_')}
        </div>
        <div id="targetBoard" className={gridSize === 4 ? "quarter" : "third"} onClick={rollTraget}>
          {drawBoard(targetBoard, 'target_')}
        </div>
      </div>
      <span >This is your grid</span>
      <div id="board" className={gridSize === 4 ? "quarter" : "third"}>
        {drawBoard(board, '')}
      </div>
      <span id="winnerBanner"></span>


    </div>
  );
}

export default App;
