import HomePage from "./home-page";
import GamePage from "./game-page";
import { GameContext } from "..";
import { useContext, useEffect } from "react";
import axios from "axios";

const Main = () =>{
    const {gameData,updateGameData} = useContext(GameContext);
    // useEffect(() =>{
    //     const getUserId = async() =>{
    //       const response = await axios.get("https://wordle-bfhl.herokuapp.com/registrar/generateUserId");
    //       updateGameData({...gameData,userId:response.data.userId})
    //     }
    //     getUserId();
    // },[])

    if(gameData.userId && !gameData.gameStart){
        return <HomePage />
    }
    if(gameData.gameStart){
        return <GamePage />
    }
    return null;
}

export default Main