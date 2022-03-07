import { useContext, useEffect, useState } from "react";
import Header from "../components/header/header";
import Modal from "../components/modal/modal";
import Slider from 'react-input-slider';
import "./home-page.scss";
import axios from "axios";
import { GameContext } from "..";

const HomePage = () =>{
    const [showHelp, setShowHelp] = useState(false);
    const {gameData,updateGameData} = useContext(GameContext);
    const handleCloseHelp = () => {
      setShowHelp(false);
    };
    const handleShowHelp = () => {
      setShowHelp(true);
    };
    const [userName,setUserName] = useState(gameData.userId);
    const [sliderX,setSliderX] = useState(4);
    const [errorMessage,setErrorMessage] = useState("")
    const handleStartGameClick = async() =>{
      // const payload = {userId: userName,wordLength: sliderX}
      // const response = await axios.post("https://wordle-bfhl.herokuapp.com/registrar/startGame",payload)
      // if(response.data.isValidUserName){
      updateGameData({...gameData,wordLength:sliderX,gameStart:true,userID:userName})
      // }
      // else{
      //   setErrorMessage("This UserName is taken. Please enter another UserName")
      // }
    }
    const setBackgroundColor = () =>{
      if(sliderX<=5)
      return "#81c784"
      else if(sliderX<=7)
      return "#FFC107"
      else
      return 'red'
    }
    return(
        <>
        <div id="home-page">
          <Header handleShowModal={handleShowHelp} />
          <div className="page-content">
          <div className="page-header">
          <h2>Welcome to BFHL Health Wordle!</h2>
          <p>Play the viral Wordle game with a twist. The words you will be guessing will all be related to health.</p>
          <h3>Enter a cool username.</h3>
          <input value={userName} onChange={(e)=>{setUserName(e.target.value)}} type="text" placeholder="Enter name"></input>
          <div style={{color:"red"}}>{errorMessage}</div>
          </div>
          <div>
            <div className="page-header">
              <h2>It's Time To Play!!</h2>
              <h3>Choose the length of the word you want to guess</h3>
              <Slider styles={{active: {backgroundColor: setBackgroundColor()}}}
              axis="x" xmin={4} xmax={8} x={sliderX} onChange={({ x }) => setSliderX(x)}/>
              <div className="difficulty-container">
                <div>Easy</div>
                <div>Medium</div>
                <div>Hard</div>
              </div>
              <h3>Word Length: {sliderX}</h3>
              <div className="button-container">
              <button className="button" type="button" onClick={handleStartGameClick}>Start Game</button>
              </div>
            </div>
          </div>
          </div>
          <Modal show={showHelp} handleClose={handleCloseHelp}>
            <div style={{color: "white"}}>
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
    )
}
export default HomePage;