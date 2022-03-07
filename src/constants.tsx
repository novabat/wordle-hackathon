export const initialGameData = {
    userId: "test",
    wordLength: 0,
    currentStep: 0,
    selectedLetters: [],
    states: [],
    guessedWords: [], 
    gameOver: false,
    gameStart: false,

}

export const gameContext = {
    gameData: initialGameData,
    updateGameData: (gameData:any) => null
}


export const generateUserPayload = {
    userId: "",
}

export const startGamePayload = {
    userId: "", //need to attach random number to the end
    wordLength: 0,
}

export const startGameResponse = {
    isValidUserName: ""
}

//frontend payload
export const playTurnPayload ={
    userId: "",
    currentStep: 1,
    wordEntered: ""
}

export const generateUserResponse = {
    userId: "", //With tag
}

export const playTurnResponse = {
    isWordValid: true,
    isWordCorrect: true,
    gameOver: false,
    absentLetters: [],
    presentLetters: [],
    correctLetters: [],
    highScore: 0
}

export const getHighScoresResponse = {
    data: []
}