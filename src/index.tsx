import "@fontsource/mulish";
import ReactDOM from "react-dom";
import { createContext, useState } from "react";
import {initialGameData} from "./constants";
import Main from "./pages/main";

export const GameContext = createContext<{gameData: any,updateGameData:any}>({gameData: initialGameData, updateGameData: (gameData:any) => null});

export default function App() {
  const [gameState,updateGameState] = useState(initialGameData)
  return(

    <GameContext.Provider value={{gameData:gameState, updateGameData: updateGameState }}>
      <Main />
    </GameContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
