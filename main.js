// Utilidades
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

function saveWebhooks() {
  localStorage.setItem('webhooks', JSON.stringify(webhooks));
}

function loadWebhooks() {
  const saved = localStorage.getItem('webhooks');
  return saved ? JSON.parse(saved) : [];
}

function createWebhookElement(webhook, index) {
  const container = document.createElement('div');
  container.className = 'webhook-item';

  const name = document.createElement('span');
  name.textContent = webhook.name || `Webhook ${index + 1}`;

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.checked = webhook.active;
  toggle.title = 'Ativar/Desativar';
  toggle.addEventListener('change', () => {
    webhook.active = toggle.checked;
    saveWebhooks();
  });

  const spamToggle = document.createElement('input');
  spamToggle.type = 'checkbox';
  spamToggle.checked = webhook.spam;
  spamToggle.title = 'Spam';
  spamToggle.addEventListener('change', () => {
    webhook.spam = spamToggle.checked;
    saveWebhooks();
  });

  const edit = document.createElement('button');
  edit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="icon-pencil" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M16.732 3.732a2.5 2.5 0 013.536 3.536l-11 11H6v-3.268l10.732-10.732z" /></svg>';
  edit.title = 'Editar';
  edit.addEventListener('click', () => {
    const newName = prompt('Novo nome:', webhook.name);
    const newAvatar = prompt('Novo avatar URL:', webhook.avatar_url);
    if (newName !== null) webhook.name = newName;
    if (newAvatar !== null) webhook.avatar_url = newAvatar;
    saveWebhooks();
    renderWebhookList();
  });

  const remove = document.createElement('button');
  remove.textContent = '🗑';
  remove.title = 'Remover';
  remove.addEventListener('click', () => {
    webhooks.splice(index, 1);
    saveWebhooks();
    renderWebhookList();
  });

  container.append(name, toggle, spamToggle, edit, remove);
  return container;
}

function renderWebhookList() {
  const list = document.getElementById('webhookList');
  list.innerHTML = '';
  webhooks.forEach((webhook, i) => {
    list.appendChild(createWebhookElement(webhook, i));
  });
}

// Variáveis globais
let webhooks = loadWebhooks();

// Eventos
$(document).ready(function () {
  renderWebhookList();

  $('#addWebhook').click(() => {
    const url = $('#webhookInput').val();
    if (!url) return showToast('Insira uma URL de webhook');
    webhooks.push({ url, active: true, spam: false, name: '', avatar_url: '' });
    saveWebhooks();
    renderWebhookList();
    $('#webhookInput').val('');
  });

  $('#sendMessage').click(() => {
    const message = $('#message').val();
    const username = $('#username').val();
    const avatar = $('#avatar').val();
    const file = document.getElementById('fileInput').files[0];

    if (!message && !file) return showToast('Mensagem ou arquivo obrigatórios');

    webhooks.forEach((hook) => {
      if (!hook.active) return;

      const sendPayload = () => {
        const form = new FormData();
        form.append('content', message);
        if (username || hook.name) form.append('username', hook.name || username);
        if (avatar || hook.avatar_url) form.append('avatar_url', hook.avatar_url || avatar);
        if (file) form.append('file', file);

        fetch(hook.url, { method: 'POST', body: form }).catch(() => showToast('Erro ao enviar para ' + (hook.name || 'Webhook')));
      };

      sendPayload();
      if (hook.spam) for (let i = 0; i < 4; i++) setTimeout(sendPayload, 500 * (i + 1));
    });

    showToast('Mensagem enviada!');
  });

  // Foto de perfil preview
  $('#profilePicInput').change(function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => $('#photoPreview').attr('src', e.target.result);
    reader.readAsDataURL(file);
  });
});
