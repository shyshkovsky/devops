/* Contact form: posts to /api/contact (email + Telegram). Self-contained; follows the site language. */
(() => {
  const T = {
    en: { name: 'Your name', email: 'Your email', company: 'Company (optional)', message: 'Your message', send: 'Send message',
          sending: 'Sending…', ok: 'Thank you! Your message has been sent.', rate: 'Too many messages, please try again later.',
          fail: 'Could not send the message. Please use email or phone instead.', net: 'Network error, please try again.' },
    ua: { name: "Ваше ім'я", email: 'Ваш email', company: 'Компанія (необов’язково)', message: 'Ваше повідомлення', send: 'Надіслати',
          sending: 'Надсилаю…', ok: 'Дякую! Повідомлення надіслано.', rate: 'Забагато повідомлень, спробуйте пізніше.',
          fail: 'Не вдалося надіслати. Скористайтеся поштою або телефоном.', net: 'Помилка мережі, спробуйте ще раз.' },
    cs: { name: 'Vaše jméno', email: 'Váš e-mail', company: 'Společnost (volitelné)', message: 'Vaše zpráva', send: 'Odeslat zprávu',
          sending: 'Odesílám…', ok: 'Děkuji! Zpráva byla odeslána.', rate: 'Příliš mnoho zpráv, zkuste to později.',
          fail: 'Zprávu se nepodařilo odeslat. Použijte prosím e-mail nebo telefon.', net: 'Chyba sítě, zkuste to znovu.' },
    pl: { name: 'Twoje imię', email: 'Twój e-mail', company: 'Firma (opcjonalnie)', message: 'Twoja wiadomość', send: 'Wyślij wiadomość',
          sending: 'Wysyłam…', ok: 'Dziękuję! Wiadomość została wysłana.', rate: 'Zbyt wiele wiadomości, spróbuj później.',
          fail: 'Nie udało się wysłać. Skorzystaj z e-maila lub telefonu.', net: 'Błąd sieci, spróbuj ponownie.' },
    de: { name: 'Ihr Name', email: 'Ihre E-Mail', company: 'Firma (optional)', message: 'Ihre Nachricht', send: 'Nachricht senden',
          sending: 'Wird gesendet…', ok: 'Danke! Ihre Nachricht wurde gesendet.', rate: 'Zu viele Nachrichten, bitte später erneut versuchen.',
          fail: 'Senden fehlgeschlagen. Bitte E-Mail oder Telefon nutzen.', net: 'Netzwerkfehler, bitte erneut versuchen.' },
  };

  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('contactStatus');
  const btn = form.querySelector('button[type="submit"]');
  const t = () => T[document.documentElement.lang] || T.en;

  function apply() {
    const d = t();
    form.elements.namedItem('name').placeholder = d.name;
    form.elements.namedItem('email').placeholder = d.email;
    form.elements.namedItem('company').placeholder = d.company;
    form.elements.namedItem('message').placeholder = d.message;
    if (!btn.disabled) btn.textContent = d.send;
  }
  new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  apply();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = t();
    btn.disabled = true; btn.textContent = d.sending; status.textContent = '';
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (r.ok) { status.textContent = d.ok; form.reset(); }
      else status.textContent = r.status === 429 ? d.rate : d.fail;
    } catch { status.textContent = d.net; }
    btn.disabled = false; btn.textContent = d.send;
  });

  // Ticket demo lives on the same host, port 8081
  const demo = document.getElementById('ticketDemoLink');
  if (demo) demo.href = `${location.protocol}//${location.hostname}:8081/`;
})();
