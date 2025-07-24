document.getElementById('send').addEventListener('click', () => {
    const url = document.getElementById('webhookUrl').value;
    const message = document.getElementById('message').value;
    const username = document.getElementById('username').value;
    const avatarUrl = document.getElementById('avatarUrl').value;
    const isSpam = document.getElementById('spamToggle').checked;
    const useDelay = document.getElementById('useDelayToggle').checked;
    const delay = parseInt(document.getElementById('delayInput').value) || 1000;

    if (!url || !message) {
        alert('Webhook URL e mensagem são obrigatórios.');
        return;
    }

    const sendMessage = () => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: message,
                username: username || undefined,
                avatar_url: avatarUrl || undefined
            })
        })
        .then(res => {
            if (!res.ok) {
                console.error(`Erro ao enviar: ${res.status}`);
                alert('Erro ao enviar a mensagem. Veja o console.');
            } else {
                console.log('Mensagem enviada com sucesso');
            }
        })
        .catch(err => {
            console.error('Erro de rede:', err);
            alert('Erro de rede. Veja o console.');
        });
    };

    if (isSpam) {
        const interval = setInterval(() => {
            if (!document.getElementById('spamToggle').checked) {
                clearInterval(interval);
                return;
            }
            sendMessage();
        }, useDelay ? delay : 1000);
    } else {
        sendMessage();
    }
});
