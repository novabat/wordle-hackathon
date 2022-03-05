import Game from "../components/game/game";
import { createContext, useState } from "react";
import {initialGameData} from "../constants";

export const GameContext = createContext<{gameData: any,updateGameData:any}>({gameData: initialGameData, updateGameData: (gameData:any) => null});
const GamePage = () =>{
    const [gameState,updateGameState] = useState(initialGameData)
    return(
        <GameContext.Provider value={{gameData:gameState, updateGameData: updateGameState }}>
        <Game/>
        </GameContext.Provider>
    )
}
export default GamePage;