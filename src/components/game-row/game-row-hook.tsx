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
import { GameContext } from "../../pages/game-page";
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
  const [guessedWords, setGuessedWords]: Array<any> =
    useState(initialGuessedWords);
  const [states, setStates]: any = useState(initialStates);
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
  const [selectedLetters, setSelectedLetters] = useState<any>([]);
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
    if (
      cookies.guessedWords &&
      cookies.states &&
      cookies.selectedLetters &&
      parseInt(cookies.index) === index
    ) {
      setGuessedWords(cookies.guessedWords);
      setStates(cookies.states);
      setSelectedLetters(cookies.selectedLetters);
      updateGameData({...gameData,currentStep:cookies.currentStep})
      setNumber(parseInt(cookies.number));
      setAnimations(cookies.animations);
      if(cookies.gameOver ===1){
        updateGameData({...gameData,gameOver:true})
      }
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
      if (isEvent(event)) {
        guessedWords[currentStep][number] = event.key.toLowerCase();
      } else {
        guessedWords[currentStep][number] = event.toLowerCase();
      }
      states[currentStep][number] = KEY_STATE.TBD;
      setGuessedWords(guessedWords);
      setStates(states);
      setNumber(number + 1);
    }
  };

  const pressEnter = () => {
    if (!gameOver) {
      if (number < wordLength) {
        refreshMessage(MESSAGE.NOT_ENOUGH_LETTER);
        refreshStates("invalid");
      } else {
        if (words.includes(guessedWords[currentStep].join(""))) {
          for (var i: number = 0; i < wordLength; i++) {
            let keyState;
            if (guessedWords[currentStep][i] === splitedWord[i]) {
              removeByAttr(
                selectedLetters,
                "letter",
                guessedWords[currentStep][i]
              );
              keyState = KEY_STATE.CORRECT;
            } else if (splitedWord.includes(guessedWords[currentStep][i])) {
              keyState = KEY_STATE.PRESENT;
            } else {
              keyState = KEY_STATE.ABSENT;
            }
            states[currentStep][i] = keyState;
            selectedLetters.push({
              letter: guessedWords[currentStep][i],
              state: keyState,
            });
            setStates(states);
            setSelectedLetters(selectedLetters);
          }
          if (currentStep === SETTING.COUNT_OF_TRY - 1) {
            updateGameData({...gameData, gameOver:true})
          }
          if (guessedWords[currentStep].join("") === word) {
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
          setCookie("states", JSON.stringify(states));
          setCookie("guessedWords", JSON.stringify(guessedWords));
          setCookie("selectedLetters", JSON.stringify(selectedLetters));
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
      console.log(states)
      states[currentStep][number - 1] = KEY_STATE.EMPTY;
      guessedWords[currentStep][number - 1] = null;
      setStates(states);
      setGuessedWords(guessedWords);
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
    states,
    animations,
    tryStates,
    guessedWords,
    message,
    selectedLetters,
  };
};
export default useGameRowHook;
