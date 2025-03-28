const URL_API = 'http://localhost:3000';
const URL_API_MESSAGE = URL_API + '/message';
const URL_API_USER = URL_API + '/user';

window.onload = async () => {
    let pseudo;
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

    window.setInterval(refreshMessages, 500);

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
        refreshMessages();
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
        });
    }
};