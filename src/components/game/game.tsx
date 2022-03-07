import { useState } from "react";
import GameRow from "../game-row/game-row";
import Header from "../header/header";
import Modal from "../modal/modal";
import "./game.scss";
const Game = () => {
  const [showHelp, setShowHelp] = useState(false);

  const handleCloseHelp = () => {
    setShowHelp(false);
  };
  const handleShowHelp = () => {
    setShowHelp(true);
  };

  return (
    <>
    <Header handleShowModal={handleShowHelp} />
    <div id="game">
      <GameRow />
      <Modal show={showHelp} handleClose={handleCloseHelp}>
        <div style={{color: "black"}}>
          <p>Welcome to BFHL Health Wordle. Guess words related to healthcare and get on the high score board. </p>
          <hr />
          <h2>Rules</h2>
          <p>Select the word size you want to play with and start guessing!</p>
          <h3>Examples</h3>
          <div>
          <div style={{height: "50px"}} className="row">
            <div className="tile" data-state='correct'>Y</div>
            <div className="tile" data-state='absent'>Y</div>
            <div className="tile" data-state='absent'>Y</div>
            <div className="tile" data-state='absent'>Y</div>
          </div>
          <p>This means that Y is present in the word and is in the correct position and the other letters are not present in the word</p>
          </div>
          <div>
          <div style={{height: "50px"}} className="row">
            <div className="tile" data-state='absent'>Y</div>
            <div className="tile" data-state='present'>Y</div>
            <div className="tile" data-state='absent'>Y</div>
            <div className="tile" data-state='absent'>Y</div>
          </div>
          <p>This means that Y is present in the word but is not in the correct position and the other letters are not present in the word</p>
          </div>

        </div>
      </Modal>
    </div>
    </>
  );
};
export default Game;
