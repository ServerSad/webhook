let webhookList = JSON.parse(localStorage.getItem("webhooks")) || [];

function saveWebhooks() {
  localStorage.setItem("webhooks", JSON.stringify(webhookList));
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

function renderWebhooks() {
  const container = document.getElementById("webhook-list");
  container.innerHTML = "";
  webhookList.forEach((webhook, index) => {
    const div = document.createElement("div");
    div.className = "webhook-entry";

    div.innerHTML = `
      <input type="checkbox" ${webhook.enabled ? "checked" : ""} onchange="toggleWebhook(${index})">
      <span>${webhook.name}</span>
      <button onclick="editWebhook(${index})"><i data-lucide="pencil"></i></button>
      <label>Spam<input type="checkbox" ${webhook.spam ? "checked" : ""} onchange="toggleSpam(${index})"></label>
    `;

    container.appendChild(div);
  });

  lucide.createIcons();
}

function toggleWebhook(index) {
  webhookList[index].enabled = !webhookList[index].enabled;
  saveWebhooks();
}

function toggleSpam(index) {
  webhookList[index].spam = !webhookList[index].spam;
  saveWebhooks();
}

function editWebhook(index) {
  const newName = prompt("Nome do Webhook:", webhookList[index].name);
  const avatar = prompt("Avatar URL:", webhookList[index].avatar);
  if (newName) webhookList[index].name = newName;
  if (avatar) webhookList[index].avatar = avatar;
  saveWebhooks();
  renderWebhooks();
}

document.getElementById("add-webhook").onclick = () => {
  const url = document.getElementById("webhook-url").value.trim();
  if (!url) return showToast("URL inválida.");
  webhookList.push({ url, name: "Novo Webhook", avatar: "", enabled: true, spam: false });
  document.getElementById("webhook-url").value = "";
  saveWebhooks();
  renderWebhooks();
};

document.getElementById("send").onclick = async () => {
  const msg = document.getElementById("message").value.trim();
  if (!msg) return showToast("Digite uma mensagem.");
  const targets = webhookList.filter(w => w.enabled);
  if (targets.length === 0) return showToast("Nenhum webhook ativado.");

  for (const hook of targets) {
    const payload = {
      content: msg,
      username: hook.name || "Bot",
      avatar_url: hook.avatar || undefined
    };

    let repeat = hook.spam ? 5 : 1;
    for (let i = 0; i < repeat; i++) {
      try {
        await fetch(hook.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        showToast("Erro ao enviar para " + hook.name);
      }
    }
  }

  showToast("Enviado com sucesso!");
};

renderWebhooks();
