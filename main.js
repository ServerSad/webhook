
document.getElementById('send').addEventListener('click', () => {
    const url = document.getElementById('webhookUrl').value;
    const message = document.getElementById('message').value;
    const isSpam = document.getElementById('spamToggle').checked;
    const useDelay = document.getElementById('useDelayToggle').checked;
    const delay = parseInt(document.getElementById('delayInput').value) || 1000;

    if (!url || !message) return alert('Webhook URL e mensagem são obrigatórios.');

    const sendMessage = () => {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message })
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
