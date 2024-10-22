const express = require("express")
const http = require('http')
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('public'))

let userCount = 0;
let arrayMsg = []
let arrayUsers = []

io.on('connection', (socket) => {
    let idUser = socket.id
    userCount++
    io.emit('user count', userCount)

    io.emit('gettingHistoric', arrayMsg)

    io.emit('gettingUsers', arrayUsers) 

    socket.on('userMensage', (dados) => {
        arrayMsg.push(dados)
        io.emit('atualizacao', dados)
    })

    socket.on('userName', (nameUser) => {
        arrayUsers.push({name:nameUser, id:idUser})
        // io.emit('updateNameUser', nameUser)
        io.emit('gettingUsers', arrayUsers) 

        console.log("Nome chegou...")
    })

    socket.on('disconnect', () => {
        userCount --
        io.emit('user count', userCount)

        let newArrayUsers = arrayUsers.filter(user => user.id !== idUser)

        arrayUsers = newArrayUsers

        console.log(arrayUsers)

        io.emit('gettingUsers', arrayUsers) //
        console.log('Usuário Saiu')
    })
})

server.listen(3000, () => {
    console.log(`http://localhost:3000`)
})