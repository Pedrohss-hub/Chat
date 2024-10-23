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
    console.log(respondText.style.display)
    if (respondText.style.display !== 'block') {
        let now = new Date()
        mensage = {value: inputText.value, user: nameUser, time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`, itsAnswer: false}
        respondText.style.display = 'none'

        socket.emit('userMensage', mensage)
        inputText.value = ''
    }
})

inputText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        console.log('Enter')
        console.log(respondText.style.display)
        if (respondText.style.display !== 'block') {
            let now = new Date()
            mensage = {value: inputText.value, user: nameUser, time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`, itsAnswer: false}
            respondText.style.display = 'none'
    
            socket.emit('userMensage', mensage)
            inputText.value = ''
        }
    }
})

// Atualizando as Mensagens

let bodyMensage = null
let bodyAnswerMessage = null
let boxDetailsAnswer = null
let boxAnswer = null

socket.on('atualizacao', (dado) => {
    console.log(dado)
    // Mensagem do Próprio Usuário
    if (dado.user === nameUser){
        
        if (dado.itsAnswer) {
            bodyAnswerMessage = document.createElement('div')
            bodyAnswerMessage.classList.add('respond-message', 'body-own-message')
            bodyAnswerMessage.setAttribute('name-user', dado.user)

            boxDetailsAnswer = document.createElement('div')
            boxDetailsAnswer.classList.add('box-details-answer')

            boxAnswer = document.createElement('div')
            boxAnswer.classList.add('box-answer')

            let value = document.createElement('p')
            value.classList.add('value-message')
            value.textContent = dado.value

            let time = document.createElement('span')
            time.classList.add('time-message')
            time.textContent = dado.time

            let detailNameUser = document.createElement('p')
            detailNameUser.classList.add('detail-name-user')
            detailNameUser.textContent = dado.answeredUser

            let detailValueUser = document.createElement('p')
            detailValueUser.classList.add('detail-value-user')
            detailValueUser.textContent = dado.answeredValue

            boxDetailsAnswer.appendChild(detailNameUser)
            boxDetailsAnswer.appendChild(detailValueUser)

            boxAnswer.appendChild(value)
            boxAnswer.appendChild(time)

            bodyAnswerMessage.appendChild(boxDetailsAnswer)
            bodyAnswerMessage.appendChild(boxAnswer)

            boxDisplay.appendChild(bodyAnswerMessage)
    
        } else {
            bodyMensage = document.createElement('div')
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
        }
    
    // Mensagem dos demais 
    } else {
        console.log(dado)
        if (dado.itsAnswer) {
            bodyAnswerMessage = document.createElement('div')
            bodyAnswerMessage.classList.add('respond-message', 'body-message')
            bodyAnswerMessage.setAttribute('name-user', dado.user)

            boxDetailsAnswer = document.createElement('div')
            boxDetailsAnswer.classList.add('box-details-answer')

            boxAnswer = document.createElement('div')
            boxAnswer.classList.add('box-answer')

            let value = document.createElement('p')
            value.classList.add('value-message')
            value.textContent = dado.value

            let time = document.createElement('span')
            time.classList.add('time-message')
            time.textContent = dado.time

            let detailNameUser = document.createElement('p')
            detailNameUser.classList.add('detail-name-user')
            detailNameUser.textContent = dado.answeredUser

            let detailValueUser = document.createElement('p')
            detailValueUser.classList.add('detail-value-user')
            detailValueUser.textContent = dado.answeredValue

            boxDetailsAnswer.appendChild(detailNameUser)
            boxDetailsAnswer.appendChild(detailValueUser)

            boxAnswer.appendChild(value)
            boxAnswer.appendChild(time)

            bodyAnswerMessage.appendChild(boxDetailsAnswer)
            bodyAnswerMessage.appendChild(boxAnswer)

            boxDisplay.appendChild(bodyAnswerMessage)
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
    }

    boxDisplay.scrollTop = boxDisplay.scrollHeight
})

//Renderizando Histórico de Mensagens

let i = 0

socket.on('gettingHistoric', (arrayMsg) => {
    console.log(arrayMsg)
    boxDisplay.innerHTML = ''
    while(i < arrayMsg.length){
    //Checar se tem mensagem do próprio cliente
        if (arrayMsg[i].user === nameUser){
            // Checar se é uma resposta
            if (arrayMsg[i].itsAnswer) {
                bodyAnswerMessage = document.createElement('div')
                bodyAnswerMessage.classList.add('respond-message', 'body-own-message')
                bodyAnswerMessage.setAttribute('name-user', arrayMsg[i].user)

                boxDetailsAnswer = document.createElement('div')
                boxDetailsAnswer.classList.add('box-details-answer')

                boxAnswer = document.createElement('div')
                boxAnswer.classList.add('box-answer')

                let value = document.createElement('p')
                value.classList.add('value-message')
                value.textContent = arrayMsg[i].value

                let time = document.createElement('span')
                time.classList.add('time-message')
                time.textContent = arrayMsg[i].time

                let detailNameUser = document.createElement('p')
                detailNameUser.classList.add('detail-name-user')
                detailNameUser.textContent = arrayMsg[i].answeredUser

                let detailValueUser = document.createElement('p')
                detailValueUser.classList.add('detail-value-user')
                detailValueUser.textContent = arrayMsg[i].answeredValue

                boxDetailsAnswer.appendChild(detailNameUser)
                boxDetailsAnswer.appendChild(detailValueUser)

                boxAnswer.appendChild(value)
                boxAnswer.appendChild(time)

                bodyAnswerMessage.appendChild(boxDetailsAnswer)
                bodyAnswerMessage.appendChild(boxAnswer)

                boxDisplay.appendChild(bodyAnswerMessage)
            } else {
                bodyMensage = document.createElement('div')
                bodyMensage.classList.add('body-own-message')
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
            }
        } else {
            if (arrayMsg[i].itsAnswer) {
                bodyAnswerMessage = document.createElement('div')
                bodyAnswerMessage.classList.add('respond-message', 'body-message')
                bodyAnswerMessage.setAttribute('name-user', arrayMsg[i].user)

                boxDetailsAnswer = document.createElement('div')
                boxDetailsAnswer.classList.add('box-details-answer')

                boxAnswer = document.createElement('div')
                boxAnswer.classList.add('box-answer')

                let value = document.createElement('p')
                value.classList.add('value-message')
                value.textContent = arrayMsg[i].value

                let time = document.createElement('span')
                time.classList.add('time-message')
                time.textContent = arrayMsg[i].time

                let detailNameUser = document.createElement('p')
                detailNameUser.classList.add('detail-name-user')
                detailNameUser.textContent = arrayMsg[i].answeredUser

                let detailValueUser = document.createElement('p')
                detailValueUser.classList.add('detail-value-user')
                detailValueUser.textContent = arrayMsg[i].answeredValue

                boxDetailsAnswer.appendChild(detailNameUser)
                boxDetailsAnswer.appendChild(detailValueUser)

                boxAnswer.appendChild(value)
                boxAnswer.appendChild(time)

                bodyAnswerMessage.appendChild(boxDetailsAnswer)
                bodyAnswerMessage.appendChild(boxAnswer)

                boxDisplay.appendChild(bodyAnswerMessage)
            } else {
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
            }
        }
        
        i++
    }
    boxDisplay.scrollTop = boxDisplay.scrollHeight
})

// Atualizando Liste de Usuários

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

});

/* Responder Mensagem */

const respondText = document.querySelector('.respond-text')
let userRespond = null
let valueRespond = null
document.addEventListener('dblclick', (e) => {
    if (e.target.className === 'body-own-message'||e.target.className === 'body-message') {
        console.log('Abriu')
        let replyMessage = e.target
        userRespond = replyMessage.getAttribute('name-user')
        valueRespond = replyMessage.querySelector('.value-message').textContent
        const respondTextValue = document.querySelector('.respond-text-value')
        const respondTextUser = document.querySelector('.respond-text-user')
        respondTextValue.innerHTML = valueRespond
        respondText.style.display = 'block'
        respondTextUser.innerHTML = userRespond 
    }
    if (e.target.className !== 'body-own-message'&& e.target.className !== 'body-message') {
        console.log('Fechou')
        respondText.style.display = 'none'
    }
    inputText.focus()
})

btnText.addEventListener('click', () => {
    if (respondText.style.display == 'block') {
        let now = new Date()
        mensage = {value: inputText.value, user: nameUser, time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`, answeredUser: userRespond, answeredValue: valueRespond, itsAnswer: true}
        respondText.style.display = 'none'

        socket.emit('userMensage', mensage)
        inputText.value = ''
    }
})


inputText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        if (respondText.style.display == 'block') {
            let now = new Date()
            mensage = {value: inputText.value, user: nameUser, time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`, answeredUser: userRespond, answeredValue: valueRespond, itsAnswer: true}
            respondText.style.display = 'none'
    
            socket.emit('userMensage', mensage)
            inputText.value = ''
        }
    }
})
