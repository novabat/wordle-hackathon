import GameTile from "../game-tile/game-tile";
import { SETTING } from "../../global/global";
import KeyBoard from "../keyboard/keyboard";
import "./game-row.scss";
import useGameRowHook from "./game-row-hook";
import { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../..";

const GameRow = () => {
  const {gameData} = useContext(GameContext)
  const {states, guessedWords,selectedLetters} = gameData
  const {wordLength} = gameData
  const {
    onKeyPressed,
    pressEnter,
    pressLetter,
    pressBackspace,
    animations,
    tryStates,
    message,
  } = useGameRowHook();

  const ref: any = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  });
  var rows = []
  if(states.length && guessedWords.length){
    for (var i = 0; i < SETTING.COUNT_OF_TRY; i++) {
      var tile = [];
      for (var j = 0; j < wordLength; j++) {
        tile.push(
          <GameTile
            state={states[i][j]}
            content={guessedWords[i][j]}
            animation={animations[i][j]}
          />
        );
      }
      rows.push(
        <div className="row" data-state={tryStates[i]}>
          {tile}
        </div>
      );
    }
  }

  return (
    <div style={{display: "flex", flexDirection: "column"}} onKeyDown={onKeyPressed} tabIndex={0} ref={ref}>
      <div id="board-container">
        <div id="board">{rows}</div>
        {message ? (
          <div className="notification" id="game-notification">
            {message}
          </div>
        ) : (
          ""
        )}
      </div>
      <KeyBoard
        selectedLetters={selectedLetters}
        pressVirualKeyBoard={pressLetter}
        pressEnter={pressEnter}
        pressBackspace={pressBackspace}
      />
    </div>
  );
};
export default GameRow;
