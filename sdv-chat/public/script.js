const URL_API = 'http://localhost:3000';
const URL_API_MESSAGE = URL_API + '/message';

window.onload = async () => {
    const divMessages = document.querySelector('.messagesSection > div');
    const textarea = document.querySelector('textarea');
    const clearBtn = document.querySelector('.clearBtn');
    const refreshBtn = document.querySelector('.refreshBtn');
    const sendBtn = document.querySelector('.sendBtn');

    refreshMessages();

    sendBtn.addEventListener("click", async () => {
        const message = textarea.value;
        textarea.value = '';
        await fetch(URL_API_MESSAGE + '/send', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
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
            div.innerText = `${date.toLocaleTimeString()} : ${message.message}`;
            divMessages.append(div);
        });
    }
};