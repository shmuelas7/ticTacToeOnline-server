const { sockets, rooms } = require('./db');
const gameLogic = require('./gameLogic')
module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("connecting now:", socket.id);

        socket.on("create-game", () => {
            let roomId = Math.floor(Math.random() * (1000000 - 100000) + 100000)
            sockets[socket.id] = roomId
            socket.join(roomId)

            socket.emit("awaiting", roomId);
        });


        socket.on("join-room", (code, player2) => {
            code = Number(code)

            if (rooms[code]) {
                return socket.emit('find-user', false);
            }
            rooms[code] = { player2 }
            sockets[socket.id] = code
            socket.join(code)
            socket.emit("find-user", true)
            socket.to(code).emit("join-user", true)

        });
        socket.on("start-game", (role, player) => {
            let roomData = rooms[sockets[socket.id]]
            if (!roomData) {
                rooms[socket.id] = { player2: { name: "computer", avatar: "img.png" } }
                sockets[socket.id] = socket.id
                socket.join(socket.id)
                roomData = rooms[socket.id]
            }

            gameLogic.initGame(roomData, player, role)

            io.to(sockets[socket.id]).emit("start-game", true)

        });
        socket.on("init-game", () => {
            const roomData = rooms[sockets[socket.id]]
            io.to(sockets[socket.id]).emit("init-game", roomData)
        })

        socket.on("move", ({ index, id }) => {
            const roomData = rooms[sockets[socket.id]]
            if (!roomData.board[index] && roomData.turn.id === id && !roomData.statusGame) {
                roomData.board[index] = roomData.turn.role
                if (gameLogic.checkWin(roomData.board, index, roomData.turn.role)) {
                    gameLogic.updateWin(roomData)
                    io.to(sockets[socket.id]).emit("move", roomData.board, roomData.turn)
                    let type = roomData.turn.role
                    return io.to(sockets[socket.id]).emit("win", { id, type })
                }

                if (gameLogic.checkTei(roomData.board)) {
                    io.to(sockets[socket.id]).emit("move", roomData.board, roomData.turn)
                    return io.to(sockets[socket.id]).emit("win", { id, type: "tei" })
                }
                if (roomData.player2.name === 'computer') {
                    let computerIndex = gameLogic.computer(roomData)
                    if (gameLogic.checkWin(roomData.board, computerIndex, roomData.player2.type)) {
                        gameLogic.updateWin(roomData)
                        io.to(sockets[socket.id]).emit("move", roomData.board, roomData.player2.type)
                        let type = roomData.player2.type
                        return io.to(sockets[socket.id]).emit("win", { id, type })
                    }
                }

                else gameLogic.changeTurn(roomData)
                io.to(sockets[socket.id]).emit("move", roomData.board, roomData.turn)
            }

            socket.on("start-again", () => {
                roomData.board = [, , , , , , , , ,]
                roomData.statusGame = false
                io.to(sockets[socket.id]).emit("init-game", roomData)
            })
        })

    });
}

