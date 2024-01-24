const socket = io("http://localhost:3000");


const form = document.getElementById('send-form');
const messageinp = document.getElementById('textinp');
const container = document.querySelector('.chat-container');
const user_list = document.querySelector('.Users-name');

const ChatAppend = (message, position) => {
    const messageelement = document.createElement('div');
    messageelement.innerText = message;
    messageelement.classList.add('message');
    messageelement.classList.add(position);
    container.append(messageelement);
    scroll();
};

function scroll() {
    container.scrollTop = container.scrollHeight;
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageinp.value;
    ChatAppend(`You: ${message}`, 'right');
    socket.emit('send', message)
    messageinp.value = "";
});

const NotificationAppend = (chat, position) => {
    const chatelement = document.createElement('div');
    chatelement.innerText = chat;
    chatelement.classList.add('chat');
    chatelement.classList.add(position);
    container.append(chatelement);
};

const name = prompt("please enter your name to join");

socket.emit("new-user-joined", name);

socket.on("user-joined", name => {
    NotificationAppend(`${name} joined the chat`, 'join');
});

socket.on("leave", name => {
    NotificationAppend(`${name} left the chat`, 'leave');
});

socket.on("recieve", data => {
    ChatAppend(`${data.name}: ${data.message}`, 'left');
});

socket.on("user-list", (name) => {
    user_list.innerHTML = "";
    user_arr = Object.values(name);
    for (i = 0; i < user_arr.length; i++) {
        const p = document.createElement('p');
        p.innerHTML = user_arr[i];
        user_list.append(p);
    }
})

