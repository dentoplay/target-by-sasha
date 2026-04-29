const BOT_TOKEN = "8382017088:AAH9v__F3Li5K0jqAAHbfPFc-x0fLpbh7PA";
const CHAT_ID = "692630299";

document.getElementById("leadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("formStatus");
  const data = Object.fromEntries(new FormData(e.target).entries());

  const text = `🔥 Новая заявка с сайта

Имя: ${data.name}
Телефон: https://t.me/${data.phone.replace("@","")}
Ниша: ${data.niche}
Сообщение: ${data.message || "—"}`;

  if (BOT_TOKEN.includes("PASTE_") || CHAT_ID.includes("PASTE_")) {
    status.textContent = "Форма готова. Нужно вставить Telegram BOT_TOKEN и CHAT_ID.";
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
  chat_id: CHAT_ID,
  text: `<b>🔥 Новая заявка</b>

<b>Имя:</b> ${data.name}
<b>Телефон:</b> ${data.phone}
<b>Ниша:</b> ${data.niche}
<b>Сообщение:</b> ${data.message || "—"}`,

  parse_mode: "HTML"
})
    });

    status.textContent = "Заявка отправлена. Скоро свяжусь с вами.";
    e.target.reset();
  } catch (err) {
    status.textContent = "Ошибка отправки. Напишите в Telegram или WhatsApp.";
  }
});