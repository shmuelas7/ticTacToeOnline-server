



const addToBoard = (index, type) => {
    if (board == "") return;
    board[index] = type;
    return board;
}
const checkTei = (board) => {
    return !board.includes(undefined);
}

const updateWin = (roomData) => {
    roomData.player1.id == roomData.turn.id ?
        roomData.player1.win++ :
        roomData.player2.win++
    roomData.statusGame = true
}
const changeTurn = (roomData) => {
    roomData.turn.id = roomData.turn.id === roomData.player1.id ?
        roomData.player2.id :
        roomData.player1.id
    roomData.turn.role = roomData.turn.role == 'x' ? 'o' : 'x'
}

const createRoom = (id) => {
    if (game.find((v) => v.roomId == id))
        return false;
    game.push({ roomId: id })
}
const resetBoard = (board) => {

}
const initGame = (roomData, player, role) => {
    roomData.player1 = { ...player, win: 0, type: role }
    roomData.player2.win = 0
    roomData.player2.type = role == 'x' ? 'o' : 'x';
    roomData.board = [, , , , , , , , ,]
    roomData.turn = { role: role, id: player.id }
    roomData.statusGame = false
}

const computer = (roomData) => {


    let board = roomData.board;
    for (let index = 0; index < 9; index++) {
        if (board[index] === ' ') {
            board[index] = roomData.player2.type
            if (checkWin(board, index, roomData.player2.type)) {
                roomData.board[index] = roomData.player2.type
                return index
            }
        }
    }
    board = roomData.board;; // Reset for the next check
    // Check if placing the player's symbol would result in a win (block)
    for (let index = 0; index < 9; index++) {
        if (board[index] === ' ') {
            board[index] = roomData.player1.type;
            if (checkWin(board, index, roomData.player1.type)) {
                roomData.board[index] = roomData.player2.type
                return index
            }
        }
    }

    let index;
    do {
        index = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
    } while (roomData.board[index])
    roomData.board[index] = roomData.player2.type
    return index

}



const checkWin = (board, index, type) => {
    if (board.filter((v) => v == type).langth < 3)
        return false
    if (index == 0 || index == 3 || index == 6) {
        if (board[index] == type && board[index + 1] == type && board[index + 2] == type)
            return true;
    }
    if (index == 2 || index == 5 || index == 8) {
        if (board[index] == type && board[index - 1] == type && board[index - 2] == type)
            return true;
    }

    if (index == 0 || index == 1 || index == 2) {
        if (board[index] == type && board[index + 3] == type && board[index + 6] == type)
            return true;
    }
    if (index == 6 || index == 7 || index == 8) {
        if (board[index] == type && board[index - 3] == type && board[index - 6] == type)
            return true;
    }

    if (index == 0 || index == 4 || index == 8) {
        if (board[0] == type && board[4] == type && board[8] == type)
            return true;
    }
    if (index == 2 || index == 4 || index == 6) {
        if (board[2] == type && board[4] == type && board[6] == type)
            return true;
    }

    if (index == 3 || index == 4 || index == 5) {
        if (board[index] == type && board[index - 3] == type && board[index + 3] == type)
            return true;
    }
    if (index == 1 || index == 4 || index == 7) {
        if (board[index] == type && board[index - 1] == type && board[index + 1] == type)
            return true;
    }

}


module.exports = { addToBoard, checkWin, createRoom, updateWin, changeTurn, resetBoard, initGame, checkTei, computer };