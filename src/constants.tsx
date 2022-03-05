export const initialGameData = {
    userId: "",
    wordLength: 5,
    currentStep: 0,
    absentLetters: [],
    presentLetters: [],
    correctLetters: [],
    gameOver: false

}

export const gameContext = {
    gameData: initialGameData,
    updateGameData: (gameData:any) => null
}


export const startGamePayload = {
    userId: "", //need to attach random number to the end
    wordLength: 0,
}

export const generateUserPayload = {
    userId: "",
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