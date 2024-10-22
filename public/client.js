const socket = io()

socket.on('user count', (count) => {
    document.querySelector('.users-count').innerText = `Usuários: ${count}`
})

// Enviando Nome de Usuário

const inputNameUser = document.querySelector('.input-name-user')
const btnInputName = document.querySelector('.button-input-name')
const login = document.querySelector('.inicial-display')
const listUsers = document.querySelector('.list-users')
let nameUser = null

inputNameUser.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        nameUser = inputNameUser.value
        socket.emit('userName', nameUser)
        login.style.display = 'none'
    }
})

btnInputName.addEventListener('click', () => {
    nameUser = inputNameUser.value
    socket.emit('userName', nameUser)
    login.style.display = 'none'
})

socket.on('updateNameUser', (nameUser) => {
    let serverNameUser = document.createElement('p')
    serverNameUser.textContent = nameUser
    serverNameUser.classList.add('user')
    listUsers.appendChild(serverNameUser)
})

// Enviando Mensagem

const boxDisplay = document.querySelector('.box-display-message')
const btnText = document.querySelector('.button-text')
const inputText = document.querySelector('.place-text')
let mensage = {}

btnText.addEventListener('click', () => {
    let now = new Date()
    mensage = {value: inputText.value, user: nameUser, time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`}

    socket.emit('userMensage', mensage)
    inputText.value = ''
})

inputText.addEventListener('keydown', (event) => {

    if (event.key === 'Enter'){
        let now = new Date()
        mensage = {value: inputText.value, user: nameUser, time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`}

        socket.emit('userMensage', mensage)
        inputText.value = ''
    }
})

socket.on('atualizacao', (dado) => {
    console.log(dado)
    if (dado.user === nameUser){
        let bodyMensage = document.createElement('div')
        bodyMensage.classList.add('body-own-message')
        bodyMensage.setAttribute('name-user', dado.user)
        let value = document.createElement('p')
        value.classList.add('value-message')
        value.textContent = dado.value
        let time = document.createElement('span')
        time.classList.add('time-message')
        time.textContent = dado.time

        bodyMensage.appendChild(value)
        bodyMensage.appendChild(time)

        boxDisplay.appendChild(bodyMensage)
    } else {
        bodyMensage = document.createElement('div')
        bodyMensage.classList.add('body-message')
        bodyMensage.setAttribute('name-user', dado.user)
        value = document.createElement('p')
        value.classList.add('value-message')
        value.textContent = dado.value
        time = document.createElement('span')
        time.classList.add('time-message')
        time.textContent = dado.time

        bodyMensage.appendChild(value)
        bodyMensage.appendChild(time)

        boxDisplay.appendChild(bodyMensage)
    }
    boxDisplay.scrollTop = boxDisplay.scrollHeight
})

// Pegando Histórico

let i = 0

socket.on('gettingHistoric', (arrayMsg) => {
    console.log(arrayMsg)

    boxDisplay.innerHTML = ''
    while(i < arrayMsg.length){
        bodyMensage = document.createElement('div')
        bodyMensage.classList.add('body-message')
        bodyMensage.setAttribute('name-user', arrayMsg[i].user)
        value = document.createElement('p')
        value.classList.add('value-message')
        value.textContent = arrayMsg[i].value
        time = document.createElement('span')
        time.classList.add('time-message')
        time.textContent = arrayMsg[i].time

        bodyMensage.appendChild(value)
        bodyMensage.appendChild(time)

        boxDisplay.appendChild(bodyMensage)
        
        i++
    }
    boxDisplay.scrollTop = boxDisplay.scrollHeight
})


socket.on('gettingUsers', (arrayUsers) => {
    listUsers.innerHTML = '';

    let indexOwnUser = arrayUsers.findIndex(user => user.id === socket.id) 
    let nameOwnUser = arrayUsers.splice(indexOwnUser, 1)
    arrayUsers.unshift(nameOwnUser[0])


    for (i = 0; i < arrayUsers.length; i++) {
        if (arrayUsers[i].id === socket.id) {
            let serverNameUser = document.createElement('p');
            serverNameUser.textContent = arrayUsers[i].name;
            serverNameUser.classList.add('own-user');
            listUsers.appendChild(serverNameUser);        
        } else {
            serverNameUser = document.createElement('p');
            serverNameUser.textContent = arrayUsers[i].name;
            serverNameUser.classList.add('user');
            listUsers.appendChild(serverNameUser);
        }
    }

    console.log(arrayUsers);
});

let c = 0

document.addEventListener('dblclick', (e) => {
    console.log(e.target)
})