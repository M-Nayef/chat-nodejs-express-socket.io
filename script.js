const socket = io()
const messageForm = document.getElementById('send-form')
const messageInput = document.getElementById("message-input")
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name')
const nameBtn = document.getElementById('name-btn')
let namee;

document.querySelector('#name-form').onsubmit = function (e) {
    e.preventDefault();
    namee = document.getElementById('name').value;
    if (namee !== "") {
        hidelanding()
        appendNoti('join', 'You')
        socket.emit('new-join', namee)
        messageInput.focus()

    }
}


messageForm.addEventListener("submit", e => {
    // to stop the page posting to server => stop refreshing the page 
    e.preventDefault()
    // send to server
    //socket.emit('event-name',data to send)
    if (messageInput.value != "") {
        const data=messageInput.value
        socket.emit('send-chat-message', data)
        messageInput.value = ''
        appendMessage({ data: data, namee: namee }, 'sent')
    }
})

socket.on('recive-message', data => {
    appendMessage(data, '')
    // `${data.namee}: ${data.message} `
})

socket.on('join-noti', (namee) => {
    appendNoti('join', namee)
})

socket.on('left', namee => {
    appendNoti('left', namee)
})

function appendMessage(message, type) {

    const messageElement = document.createElement('div')
    const icon = document.createElement("img")
    icon.src=Avatar(message.namee)
    messageElement.appendChild(icon)
    const pElement = document.createElement('p')

    const unAttr = document.createAttribute('username')
    pElement.setAttributeNode(unAttr)
 

    pElement.innerText = message.data
    if (type == 'sent') {
        messageElement.className = "message sent"
        pElement.username='you'
    }
    else {
        messageElement.className = "message"
        pElement.setAttribute('username', `${message.namee}`)
    }
    messageElement.appendChild(pElement)
    messageContainer.appendChild(messageElement)
    messageContainer.scrollTop = messageContainer.scrollHeight;


}
function appendNoti(type, name) {
    if (type == "join" || type == "left") {
        const notification = document.createElement("div")
        notification.className = `notification ${type}`
        let attr = document.createAttribute("username")
        notification.setAttributeNode(attr)
        notification.setAttribute('username', name)
        messageContainer.appendChild(notification)
        messageContainer.scrollTop = messageContainer.scrollHeight;

    }

}
function hidelanding() {
    document.getElementById("landing").style.display = "none";
}
function Avatar(name){
    return `https://avatars.dicebear.com/api/bottts/${name}.svg`
}
