const URL_API = 'http://localhost:3000';
const URL_API_MESSAGE = URL_API + '/message';
const URL_API_USER = URL_API + '/user';

const socket = io();

let pseudo = 'Machin';

while (pseudo === undefined) {
    pseudo = prompt("Pseudo ?");
    const response = await fetch(URL_API_USER + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pseudo
        })
    });
    if (response.status !== 200) {
        pseudo = undefined;
    }
}

const divMessages = document.querySelector('.messagesSection > div');
const textarea = document.querySelector('textarea');
const clearBtn = document.querySelector('.clearBtn');
const refreshBtn = document.querySelector('.refreshBtn');
const sendBtn = document.querySelector('.sendBtn');

refreshMessages();

socket.emit('pseudo', pseudo);

socket.on('login', pseudo => {
    const div = document.createElement('div');
    div.innerText = `${pseudo} vient de se connecter`;
    div.style.fontWeight = 'bold';
    divMessages.append(div);
});
socket.on('logout', pseudo => {
    const div = document.createElement('div');
    div.innerText = `${pseudo} vient de se déconnecter`;
    div.style.fontWeight = 'bold';
    divMessages.append(div);
});
socket.on('message', message => {
    ajouterMessage(message);
});

sendBtn.addEventListener("click", async () => {
    const message = textarea.value;
    textarea.value = '';
    await fetch(URL_API_MESSAGE + '/send', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            pseudo,
            date: new Date(),
            message
        })
    });
    // refreshMessages();
});

refreshBtn.addEventListener('click', refreshMessages);

clearBtn.addEventListener('click', async () => {
    await fetch(URL_API_MESSAGE + '/clear');
    refreshMessages();
});

async function refreshMessages() {
    const response = await fetch(URL_API_MESSAGE + '/get');
    const tableauMessages = await response.json();
    divMessages.innerText = '';
    tableauMessages.forEach(message => {
        ajouterMessage(message);
    });
}

function ajouterMessage(message) {
    const div = document.createElement('div');
    div.classList.add("message");
    const date = new Date(message.date);
    div.innerHTML = `
        <span class='date'></span>
        <span class='pseudo'></span>
        -
        <span class='message'></span>
    `;
    div.querySelector('.pseudo').innerText = message.pseudo;
    div.querySelector('.date').innerText = date.toLocaleDateString();
    div.querySelector('.message').innerText = message.message;
    divMessages.append(div);
}