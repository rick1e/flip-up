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


    const cell = document.getElementById(index)
    let newBoard = board;
    newBoard[index] = user === 2 ? user : (newBoard[index] + 1) % 3
    cell.className = getCellStyle(newBoard[index])
    setBoard(newBoard)

    if (checkComplete(newBoard)) {
      endGame()
      setInstructions("Tap a tile in your grid to reset")
    }





  }
  const drawTargetBoard = () => {
    const boardDivs = targetBoard.map((cell, index) => {
      let cellStyle = getCellStyle(cell)
      return <div key={index} id={'target_' + index} className={cellStyle}></div>
    })

    return boardDivs;
  }

  const drawBoard = () => {
    const boardDivs = board.map((cell, index) => {
      let cellStyle = getCellStyle(cell)
      return <div key={index} id={index} className={cellStyle} onClick={() => { flip(index, 1) }}></div>
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
      <div id="targetBoard" className={gridSize === 4 ? "quarter" : "third"} onClick={rollTraget}>
        {drawTargetBoard()}
      </div>
      <span >This is your grid</span>
      <div id="board" className={gridSize === 4 ? "quarter" : "third"}>
        {drawBoard()}
      </div>
      <span id="winnerBanner"></span>


    </div>
  );
}

export default App;
