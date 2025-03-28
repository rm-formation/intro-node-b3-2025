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
        await fetch('http://localhost:3000/postMessage', {
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
        await fetch('http://localhost:3000/clearMessages');
        refreshMessages();
    });

    async function refreshMessages() {
        const response = await fetch('http://localhost:3000/getMessages');
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