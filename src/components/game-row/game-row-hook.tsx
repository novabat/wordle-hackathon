import { useContext, useEffect } from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import {
  ANIMATIONS,
  KEYBOARD,
  KEY_STATE,
  MESSAGE,
  SETTING,
} from "../../global/global";
import { gameWords } from "../../global/game-words";
import {
  findDateDiff,
  isEvent,
  isValidChar,
  removeByAttr,
} from "./game-row-helper";
import { IKeyBoardEvent } from "./game-row-interface";
import { GameContext } from "../..";
import axios from "axios";
var words = require("an-array-of-english-words");

const useGameRowHook = () => {
  const {gameData,updateGameData} = useContext(GameContext);
  const [message, setMessage] = useState("");
  const initialGuessedWords = Array.from(Array(SETTING.COUNT_OF_TRY), () =>
    new Array(gameData.wordLength).fill(null)
  );
  const initialStates = Array.from(Array(SETTING.COUNT_OF_TRY), () =>
    new Array(gameData.wordLength).fill(KEY_STATE.EMPTY)
  );
  const [animations, setAnimations]: any = useState(
    Array.from(Array(SETTING.COUNT_OF_TRY), () =>
      new Array(gameData.wordLength).fill(null)
    )
  );
  const [tryStates, setTryStates] = useState(
    new Array(SETTING.COUNT_OF_TRY).fill(null)
  );
  const [number, setNumber] = useState(0);
  const {currentStep, gameOver, wordLength} = gameData;
  const [cookies, setCookie] = useCookies([
    "index",
    "states",
    "guessedWords",
    "selectedLetters",
    "currentStep",
    "number",
    "gameOver",
    "animations",
  ]);
  const [word, setWord]: any = useState("");
  const { Difference_In_Days: index } = findDateDiff();
  useEffect(() => {
    setWord(gameWords[index]);
    console.log(gameData.wordLength)
    if (
      cookies.guessedWords &&
      cookies.states &&
      cookies.selectedLetters &&
      parseInt(cookies.index) === index
    ) {
      updateGameData({...gameData,currentStep:cookies.currentStep,guessedWords:cookies.guessedWords,states:cookies.states,selectedLetters:cookies.selectedLetters})
      setNumber(parseInt(cookies.number));
      setAnimations(cookies.animations);
      if(cookies.gameOver ===1){
        updateGameData({...gameData,gameOver:true})
      }
    }
    else{
      updateGameData({...gameData, states:initialStates,guessedWords: initialGuessedWords});
    }
  }, []);
  const splitedWord = word.split("");

  const refreshMessage = (content: string, miniSec: number = 1000) => {
    setMessage(content);
    setTimeout(() => {
      setMessage("");
    }, miniSec);
  };

  const refreshStates = (state: string) => {
    tryStates[currentStep] = state;
    setTryStates(tryStates);
    setTimeout(() => {
      setTryStates(new Array(SETTING.COUNT_OF_TRY).fill(null));
    }, 1000);
  };

  const pressLetter = (event: IKeyBoardEvent | string) => {
    if (number < wordLength && !gameOver) {
      let guessedWordsNew = gameData.guessedWords;
      if (isEvent(event)) {
        guessedWordsNew[currentStep][number] = event.key.toLowerCase();
        updateGameData({...gameData,guessedWords:guessedWordsNew})
      } else {
        guessedWordsNew[currentStep][number] = event.toLowerCase();
        updateGameData({...gameData,guessedWords:guessedWordsNew})
      }
      let statesNew = gameData.states;
      statesNew[currentStep][number] = KEY_STATE.TBD;
      updateGameData({...gameData,guessedWords:guessedWordsNew,states:statesNew})
      setNumber(number + 1);
    }
  };

  const pressEnter = async() => {
    if (!gameOver) {
      if (number < wordLength) {
        refreshMessage(MESSAGE.NOT_ENOUGH_LETTER);
        refreshStates("invalid");
      } else {
        // const payload = {userId: gameData.userId,wordEntered:gameData.guessedWords[currentStep].join(""),currentStep:gameData.currentStep}
        // const response = await axios.post('https://wordle-bfhl.herokuapp.com/ingame/gameAttempt',payload)
        // if(response.data){
        //   if(response.data.isWordValid){
            
        //   }
          
        // }
        if (words.includes(gameData.guessedWords[currentStep].join(""))) {
          for (var i: number = 0; i < wordLength; i++) {
            let keyState;
            if (gameData.guessedWords[currentStep][i] === splitedWord[i]) {
              removeByAttr(
                gameData.selectedLetters,
                "letter",
                gameData.guessedWords[currentStep][i]
              );
              keyState = KEY_STATE.CORRECT;
            } else if (splitedWord.includes(gameData.guessedWords[currentStep][i])) {
              keyState = KEY_STATE.PRESENT;
            } else {
              keyState = KEY_STATE.ABSENT;
            }
            let statesNew = gameData.states
            let selectedLettersNew = gameData.selectedLetters
            statesNew[currentStep][i] = keyState;
            selectedLettersNew.push({
              letter: gameData.guessedWords[currentStep][i],
              state: keyState,
            });
            updateGameData({...gameData, states:statesNew, selectedLetters:selectedLettersNew})
          }
          if (currentStep === SETTING.COUNT_OF_TRY - 1) {
            updateGameData({...gameData, gameOver:true})
          }
          if (gameData.guessedWords[currentStep].join("") === word) {
            animations[currentStep].fill(ANIMATIONS.SCALE_CENTER);
            setAnimations(animations);
            refreshMessage(MESSAGE.CORRECT);
            updateGameData({...gameData, gameOver:true})
            setCookie("gameOver", 1);
          } else {
            animations[currentStep].fill(ANIMATIONS.SCALE_CENTER);
            setAnimations(animations);
            const nextTry = currentStep + 1;
            updateGameData({...gameData, currentStep:nextTry})
            setNumber(0);
            if (currentStep === SETTING.COUNT_OF_TRY - 1) {
              refreshMessage(word, 3000);
              setCookie("gameOver", 1);
            } else {
              refreshMessage(MESSAGE.INCORRECT);
              setCookie("currentStep", nextTry);
              setCookie("number", 0);
              setCookie("gameOver", 0);
            }
          }
          setCookie("states", JSON.stringify(gameData.states));
          setCookie("guessedWords", JSON.stringify(gameData.guessedWords));
          setCookie("selectedLetters", JSON.stringify(gameData.selectedLetters));
          setCookie("animations", JSON.stringify(animations));
          setCookie("index", index);
        } else {
          refreshMessage(MESSAGE.NOT_EXIST);
        }
      }
    }
  };

  const pressBackspace = () => {
    if (number > 0 && !gameOver) {
      let statesNew = gameData.states;
      let guessedWordsNew = gameData.guessedWords;
      statesNew[currentStep][number - 1] = KEY_STATE.EMPTY;
      guessedWordsNew[currentStep][number - 1] = null;
      updateGameData({...gameData,states:statesNew,guessedWords:guessedWordsNew })
      setNumber(number - 1);
    }
  };

  const onKeyPressed = (event: IKeyBoardEvent) => {
    if (!gameOver) {
      if (isValidChar(event)) {
        pressLetter(event);
      } else if (event.keyCode === KEYBOARD.BACKSPACE) {
        pressBackspace();
      } else if (event.keyCode === KEYBOARD.ENTER) {
        pressEnter();
      }
    } else {
      refreshMessage(MESSAGE.FINISH_GAME);
    }
  };

  return {
    onKeyPressed,
    pressEnter,
    pressLetter,
    pressBackspace,
    animations,
    tryStates,
    message
  };
};
export default useGameRowHook;
