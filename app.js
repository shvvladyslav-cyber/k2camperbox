/* app.js — K2 CamperBox (premium, fast, no-build)
   Fixes:
   - Install button hides when app is already installed (standalone) + after install
   - Better i18n: fallback to DE if key missing + translates placeholders via data-i18n-placeholder
   - Telegram: opens share link with prefilled text (+ clipboard fallback)
   - Single toast (no duplicates), safer event handling
*/
(() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const cfg = {
    telegram: "https://t.me/k2camperbox",
    telegramUsername: "@k2camperbox",
    phone: "+4916096527272",
    email: "k2camperbox@gmail.com",
    projectName: "K2 CamperBox",
  };

  // ===== i18n =====
  const i18n = {
    de: {
      nav_models: "Modelle",
      nav_packages: "Pakete",
      nav_gallery: "Galerie",
      nav_faq: "FAQ",
      nav_contact: "Kontakt",
      nav_cfg: "Konfigurator",
      nav_cab: "Cabinet",

      hero_badge: "🇩🇪 Kassel • Deutschland • Lieferung/Einbau",
      hero_title: "K2 CamperBox — dein Auto in 5 Minuten zum Camper",
      hero_lead:
        "Modulares Camping-System für Hochdachkombis (Caddy / Berlingo / Combo / Doblo / Tourneo / …). Schnell anfragen in Telegram + bequeme Bezahlung über Revolut QR.",

      cta_request: "Anfrage in Telegram",
      cta_pay: "Revolut QR bezahlen",
      cta_install: "App installieren",
      cta_installed: "App installiert ✓",

      mini_1_k: "Schnell",
      mini_1_v: "Aufbau 5–10 Min",
      mini_2_k: "Modular",
      mini_2_v: "Boxen / Bett / Küche",
      mini_3_k: "Praktisch",
      mini_3_v: "Für Alltag & Reise",

      hero_card_title: "Sofort-Angebot",
      hero_card_pill: "Heute antworten",
      hero_card_model: "Auto/Modell",
      hero_card_wishes: "Wünsche",
      hero_card_send: "In Telegram senden",
      hero_card_copy: "Text kopieren",
      hero_card_hint:
        "Tipp: Wenn Telegram nicht öffnet — kopiere den Text und sende ihn an @k2camperbox.",

      stat_1: "3 Sprachen",
      stat_2: "als App installierbar",
      stat_3: "Revolut Bezahlung",

      models_title: "Für welche Autos?",
      models_sub: "Hochdachkombis & kompakte Vans — wir passen das Modul an.",
      models_1: "Caddy / Caddy Maxi — Alltag + Reise.",
      models_2: "Berlingo / Rifter / Partner — modulare Boxen.",
      models_3: "Combo / Doblo / Tourneo / Kangoo / …",

      packages_title: "Pakete",
      packages_sub: "Beispiele. Endpreis hängt vom Auto und den Optionen ab.",
      pkg_1_name: "Start",
      pkg_1_a: "Bettplatte + Grund-Boxen",
      pkg_1_b: "Schneller Ein-/Ausbau",
      pkg_1_c: "Leicht & stabil",
      pkg_2_name: "Comfort",
      pkg_2_a: "Mehr Stauraum + Orga",
      pkg_2_b: "Matratze / Polster-Set",
      pkg_2_c: "Option: Auszug-Tisch",
      pkg_3_name: "Pro",
      pkg_3_a: "Küchen-Modul + Wasser",
      pkg_3_b: "12V / Power-Optionen",
      pkg_3_c: "Individuelle Anpassung",
      pkg_btn: "Anfragen",

      gallery_title: "Galerie (Platzhalter)",
      gallery_sub: "Tausche diese Bilder gegen deine echten Fotos (siehe Anleitung unten).",
      gallery_note:
        "Foto-Dateien: /assets/gallery-1.jpg … /assets/gallery-4.jpg (du kannst deine hochladen).",

      faq_title: "FAQ",
      faq_sub: "Kurz & ehrlich — für Einsteiger.",
      faq_q1: "Wie schnell kann ich bestellen?",
      faq_a1: "Schreib in Telegram, wir klären Auto + Optionen. Danach bekommst du Preis & сроки.",
      faq_q2: "Kann ich mit Revolut bezahlen?",
      faq_a2: "Ja. Klicke „Revolut QR bezahlen“ — QR öffnet sich. In Revolut scannen und zahlen.",
      faq_q3: "App installieren?",
      faq_a3: "Öffne die Website in Chrome → „App installieren“. Oder klicke den Button „App installieren“.",

      form_title: "Anfrage-Formular",
      form_sub: "Sende Anfrage direkt in Google Sheets (Apps Script).",
      f_name: "Name",
      f_phone: "Telefon",
      f_email: "Email",
      f_car: "Auto/Modell",
      f_msg: "Nachricht",
      f_send: "In Sheets senden",
      f_open_crm: "Mini-CRM öffnen",
      f_send_tg: "Oder in Telegram senden",
      f_hint:
        "Damit das Formular funktioniert: Apps Script URL in crm-config.js eintragen. Sonst nutze Telegram.",

      contact_title: "Kontakt",
      contact_sub: "Alles klickbar: Telegram • Telefon • Email • Zahlung.",
      contact_phone: "Telefon",
      contact_pay: "Bezahlen",
      contact_pay_sub: "Revolut QR",
      footer_top: "Nach oben",

      pay_title: "Revolut QR bezahlen",
      pay_hint: "Revolut öffnen → Scan → QR scannen → bezahlen.",
      pay_to: "Empfänger:",
      pay_note: "Kommentar:",
      pay_replace:
        "Wichtig: Das ist ein Demo-QR. Ersetze /assets/revolut-qr.png mit deinem echten Revolut-QR.",
      pay_download: "QR herunterladen",
      pay_close: "Schließen",

      toast_copied: "Kopiert ✅",
      toast_installed: "App installiert ✅",
      toast_install_tip: "Chrome → Menü → App installieren",
      toast_sent: "Gesendet ✅",
      toast_form_not_ready: "Formular nicht konfiguriert (SCRIPT_URL). Nutze Telegram.",
      toast_send_fail: "Senden fehlgeschlagen",
      toast_network_fail: "Netzwerk/Script Fehler",
    },

    ua: {
      nav_models: "Авто",
      nav_packages: "Пакети",
      nav_gallery: "Галерея",
      nav_faq: "FAQ",
      nav_contact: "Контакти",
      nav_cfg: "Конфігуратор",
      nav_cab: "Кабінет",

      hero_badge: "🇩🇪 Кассель • Німеччина • Доставка/монтаж",
      hero_title: "K2 CamperBox — перетвори авто на кемпер за 5 хвилин",
      hero_lead:
        "Модульна система для мінівенів/«каблучків» (Caddy / Berlingo / Combo / Doblo / Tourneo / …). Швидка заявка в Telegram + оплата через Revolut QR.",

      cta_request: "Заявка в Telegram",
      cta_pay: "Оплатити Revolut QR",
      cta_install: "Встановити додаток",
      cta_installed: "Додаток встановлено ✓",

      mini_1_k: "Швидко",
      mini_1_v: "Монтаж 5–10 хв",
      mini_2_k: "Модульно",
      mini_2_v: "Бокси / ліжко / кухня",
      mini_3_k: "Зручно",
      mini_3_v: "Для міста й подорожей",

      hero_card_title: "Швидкий запит",
      hero_card_pill: "Відповімо сьогодні",
      hero_card_model: "Авто/модель",
      hero_card_wishes: "Побажання",
      hero_card_send: "Надіслати в Telegram",
      hero_card_copy: "Скопіювати текст",
      hero_card_hint: "Порада: якщо Telegram не відкрився — скопіюй текст і надішли @k2camperbox.",

      stat_1: "3 мови",
      stat_2: "можна встановити як App",
      stat_3: "оплата Revolut",

      models_title: "Для яких авто?",
      models_sub: "«Каблучки» та компактні вени — адаптуємо під твоє авто.",
      models_1: "Caddy / Caddy Maxi — місто + подорож.",
      models_2: "Berlingo / Rifter / Partner — модульні бокси.",
      models_3: "Combo / Doblo / Tourneo / Kangoo / …",

      packages_title: "Пакети",
      packages_sub: "Приклади. Фінальна ціна залежить від авто та опцій.",
      pkg_1_name: "Start",
      pkg_1_a: "Основа-ліжко + базові бокси",
      pkg_1_b: "Швидкий монтаж/демонтаж",
      pkg_1_c: "Легко та міцно",
      pkg_2_name: "Comfort",
      pkg_2_a: "Більше зберігання + органайзери",
      pkg_2_b: "Матрац / комплект подушок",
      pkg_2_c: "Опція: висувний столик",
      pkg_3_name: "Pro",
      pkg_3_a: "Кухонний модуль + вода",
      pkg_3_b: "12V / енергетичні опції",
      pkg_3_c: "Індивідуальна адаптація",
      pkg_btn: "Запитати",

      gallery_title: "Галерея (плейсхолдер)",
      gallery_sub: "Заміни ці картинки на свої фото (див. інструкцію нижче).",
      gallery_note: "Файли фото: /assets/gallery-1.jpg … /assets/gallery-4.jpg (можеш залити свої).",

      faq_title: "FAQ",
      faq_sub: "Коротко і по-людськи — для новачків.",
      faq_q1: "Як швидко можна замовити?",
      faq_a1: "Напиши в Telegram, уточнимо авто + опції. Потім ціна і строки.",
      faq_q2: "Можна оплатити через Revolut?",
      faq_a2: "Так. Натисни «Оплатити Revolut QR» — відкриється QR. Скануй у Revolut і плати.",
      faq_q3: "Як встановити додаток?",
      faq_a3: "Відкрий сайт у Chrome → «Встановити». Або натисни кнопку «Встановити додаток».",

      form_title: "Форма заявки",
      form_sub: "Надсилає заявку в Google Sheets (через Apps Script).",
      f_name: "Імʼя",
      f_phone: "Телефон",
      f_email: "Email",
      f_car: "Авто/модель",
      f_msg: "Повідомлення",
      f_send: "Надіслати в Sheets",
      f_open_crm: "Відкрити Mini-CRM",
      f_send_tg: "Або надіслати в Telegram",
      f_hint:
        "Щоб форма працювала: встав Apps Script URL у crm-config.js. Якщо не налаштовано — використовуй Telegram.",

      contact_title: "Контакти",
      contact_sub: "Все клікабельне: Telegram • Телефон • Email • Оплата.",
      contact_phone: "Телефон",
      contact_pay: "Оплата",
      contact_pay_sub: "Revolut QR",
      footer_top: "Вгору",

      pay_title: "Оплата Revolut QR",
      pay_hint: "Відкрий Revolut → Scan → наведи на QR → оплати.",
      pay_to: "Одержувач:",
      pay_note: "Коментар:",
      pay_replace: "Важливо: це демо QR. Заміни /assets/revolut-qr.png на твій реальний QR з Revolut.",
      pay_download: "Завантажити QR",
      pay_close: "Закрити",

      toast_copied: "Скопійовано ✅",
      toast_installed: "Додаток встановлено ✅",
      toast_install_tip: "Chrome → Меню → Встановити додаток",
      toast_sent: "Надіслано ✅",
      toast_form_not_ready: "Форма не налаштована (SCRIPT_URL). Використай Telegram.",
      toast_send_fail: "Помилка відправки",
      toast_network_fail: "Помилка мережі/скрипта",
    },

    ru: {
      nav_models: "Авто",
      nav_packages: "Пакеты",
      nav_gallery: "Галерея",
      nav_faq: "FAQ",
      nav_contact: "Контакты",
      nav_cfg: "Конфигуратор",
      nav_cab: "Кабинет",

      hero_badge: "🇩🇪 Кассель • Германия • Доставка/установка",
      hero_title: "K2 CamperBox — превращаем авто в кемпер за 5 минут",
      hero_lead:
        "Модульная система для «каблучков» и компактных ванов (Caddy / Berlingo / Combo / Doblo / Tourneo / …). Быстрая заявка в Telegram + оплата через Revolut QR.",

      cta_request: "Заявка в Telegram",
      cta_pay: "Оплата Revolut QR",
      cta_install: "Установить приложение",
      cta_installed: "Приложение установлено ✓",

      mini_1_k: "Быстро",
      mini_1_v: "Установка 5–10 мин",
      mini_2_k: "Модульно",
      mini_2_v: "Боксы / кровать / кухня",
      mini_3_k: "Удобно",
      mini_3_v: "На каждый день и в поездку",

      hero_card_title: "Быстрый расчет",
      hero_card_pill: "Ответим сегодня",
      hero_card_model: "Авто/модель",
      hero_card_wishes: "Пожелания",
      hero_card_send: "Отправить в Telegram",
      hero_card_copy: "Скопировать текст",
      hero_card_hint: "Подсказка: если Telegram не открылся — скопируй текст и отправь @k2camperbox.",

      stat_1: "3 языка",
      stat_2: "ставится как App",
      stat_3: "оплата Revolut",

      models_title: "Для каких авто?",
      models_sub: "«Каблучки» и компактные ваны — адаптируем модуль.",
      models_1: "Caddy / Caddy Maxi — город + путешествия.",
      models_2: "Berlingo / Rifter / Partner — модульные боксы.",
      models_3: "Combo / Doblo / Tourneo / Kangoo / …",

      packages_title: "Пакеты",
      packages_sub: "Примеры. Итоговая цена зависит от авто и опций.",
      pkg_1_name: "Start",
      pkg_1_a: "Основа-кровать + базовые боксы",
      pkg_1_b: "Быстрая установка/снятие",
      pkg_1_c: "Легко и надежно",
      pkg_2_name: "Comfort",
      pkg_2_a: "Больше хранения + организация",
      pkg_2_b: "Матрас / комплект подушек",
      pkg_2_c: "Опция: выдвижной столик",
      pkg_3_name: "Pro",
      pkg_3_a: "Кухонный модуль + вода",
      pkg_3_b: "12V / питание",
      pkg_3_c: "Индивидуальная подгонка",
      pkg_btn: "Узнать цену",

      gallery_title: "Галерея (заглушка)",
      gallery_sub: "Поменяй эти картинки на свои фото (см. инструкцию ниже).",
      gallery_note: "Файлы фото: /assets/gallery-1.jpg … /assets/gallery-4.jpg (можешь загрузить свои).",

      faq_title: "FAQ",
      faq_sub: "Коротко и по-человечески — для чайника.",
      faq_q1: "Как быстро можно заказать?",
      faq_a1: "Напиши в Telegram, уточним авто + опции. Потом цена и сроки.",
      faq_q2: "Можно оплатить Revolut?",
      faq_a2: "Да. Нажми «Оплата Revolut QR» — откроется окно с QR. Сканируешь в Revolut и оплачиваешь.",
      faq_q3: "Как установить приложение?",
      faq_a3: "Открой сайт в Chrome → «Установить приложение». Или нажми кнопку «Установить приложение».",

      form_title: "Форма заявки",
      form_sub: "Отправляет заявку в Google Sheets (через Apps Script).",
      f_name: "Имя",
      f_phone: "Телефон",
      f_email: "Email",
      f_car: "Авто/модель",
      f_msg: "Сообщение",
      f_send: "Отправить в Sheets",
      f_open_crm: "Открыть Mini-CRM",
      f_send_tg: "Или отправить в Telegram",
      f_hint:
        "Чтобы форма работала: вставь Apps Script URL в crm-config.js. Если не настроено — используй Telegram.",

      contact_title: "Контакты",
      contact_sub: "Все кликабельно: Telegram • Телефон • Email • Оплата.",
      contact_phone: "Телефон",
      contact_pay: "Оплата",
      contact_pay_sub: "Revolut QR",
      footer_top: "Наверх",

      pay_title: "Оплата Revolut QR",
      pay_hint: "Открой Revolut → Scan → наведи на QR → оплати.",
      pay_to: "Получатель:",
      pay_note: "Комментарий:",
      pay_replace: "Важно: это демо QR. Замени /assets/revolut-qr.png на свой реальный QR из Revolut.",
      pay_download: "Скачать QR",
      pay_close: "Закрыть",

      toast_copied: "Скопировано ✅",
      toast_installed: "Приложение установлено ✅",
      toast_install_tip: "Chrome → Меню → Установить приложение",
      toast_sent: "Отправлено ✅",
      toast_form_not_ready: "Форма не настроена (SCRIPT_URL). Используй Telegram.",
      toast_send_fail: "Ошибка отправки",
      toast_network_fail: "Ошибка сети/скрипта",
    },
  };

  const getLang = () => localStorage.getItem("k2_lang") || "de";
  const t = (key) => i18n[getLang()]?.[key] ?? i18n.de?.[key] ?? "";

  // ===== toast (single) =====
  const toast = (msg) => {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.style.cssText =
        "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);padding:10px 12px;border-radius:12px;border:1px solid rgba(36,48,95,.8);background:rgba(11,18,48,.92);backdrop-filter: blur(10px);font-weight:800;z-index:120;opacity:0;transition:opacity .15s ease;max-width:92vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    clearTimeout(toast._tm);
    toast._tm = setTimeout(() => (el.style.opacity = "0"), 1400);
  };

  // ===== Telegram (prefilled) =====
  const tgShareUrl = (text) => {
    // t.me/share works in most browsers. Telegram app may ignore text sometimes; we also copy to clipboard.
    const u = new URL("https://t.me/share/url");
    u.searchParams.set("url", location.href);
    u.searchParams.set("text", text);
    return u.toString();
  };

  const writeClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  const openTelegram = async (text) => {
    // Copy first for reliability
    await writeClipboard(text);
    // Try share link with prefilled text
    const share = tgShareUrl(text);
    window.open(share, "_blank", "noopener");
    // If user prefers direct chat, they still see hint in UI
  };

  const buildMessage = (pkg) => {
    const model = ($("#carModel")?.value || "").trim();
    const wishes = ($("#wishes")?.value || "").trim();

    const lines = [
      `👋 ${cfg.projectName} Anfrage`,
      pkg ? `📦 Paket: ${pkg}` : null,
      model ? `🚗 Auto: ${model}` : null,
      wishes ? `📝 Wünsche: ${wishes}` : null,
      `📞 Telefon: ${cfg.phone}`,
      `✉️ Email: ${cfg.email}`,
      `—`,
      `Bitte цену/срок + что нужно для заказа.`,
    ].filter(Boolean);

    return lines.join("\n");
  };

  // ===== i18n apply =====
  const setLang = (lang) => {
    const norm = lang === "ua" ? "uk" : lang;
    document.documentElement.lang = norm;

    $$(".chip").forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    // text nodes
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = i18n[lang]?.[key] ?? i18n.de?.[key];
      if (typeof val === "string") el.textContent = val;
    });

    // placeholders (optional usage in HTML)
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = i18n[lang]?.[key] ?? i18n.de?.[key];
      if (typeof val === "string") el.setAttribute("placeholder", val);
    });

    localStorage.setItem("k2_lang", lang);

    // If install button exists, refresh its label depending on installed state
    refreshInstallButtonState();
  };

  // ===== Pay Modal =====
  const modal = $("#payModal");
  const openPay = () => {
    if (!modal) return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  };
  const closePay = () => {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  };

  // ===== PWA install button fix =====
  const isStandalone = () => {
    // Chrome/Edge/Android: display-mode
    const dm = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    // iOS Safari: navigator.standalone
    const ios = typeof navigator.standalone === "boolean" && navigator.standalone;
    return !!(dm || ios);
  };

  let deferredPrompt = null;

  const hideInstallButton = () => {
    const b = $("#btnInstall");
    if (!b) return;
    b.style.display = "none";
    b.setAttribute("aria-hidden", "true");
  };

  const showInstallButton = () => {
    const b = $("#btnInstall");
    if (!b) return;
    b.style.display = "";
    b.removeAttribute("aria-hidden");
  };

  const markInstalledLabel = () => {
    const b = $("#btnInstall");
    if (!b) return;
    b.textContent = t("cta_installed") || "Installed ✓";
    b.disabled = true;
    // You can also hide it completely; but you asked specifically “убирать”
    // so we will hide when installed:
    hideInstallButton();
  };

  const refreshInstallButtonState = () => {
    const b = $("#btnInstall");
    if (!b) return;

    if (isStandalone()) {
      // already installed / opened as app
      markInstalledLabel();
      return;
    }

    // Not installed: show it (but "enabled" only if prompt is available; otherwise keep as ghost)
    showInstallButton();
    b.disabled = false;

    // If prompt not available, keep it "ghost" style, user can still click and get tip
    if (!deferredPrompt) b.classList.add("ghost");
  };

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const b = $("#btnInstall");
    if (b) b.classList.remove("ghost");

    // if not standalone, keep visible
    refreshInstallButtonState();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    toast(t("toast_installed") || "Installed ✅");
    markInstalledLabel();
  });

  const installApp = async () => {
    // If already installed/opened as app
    if (isStandalone()) {
      markInstalledLabel();
      return;
    }

    if (!deferredPrompt) {
      toast(t("toast_install_tip") || "Chrome → Menü → App installieren");
      return;
    }

    deferredPrompt.prompt();
    try {
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;

      // If accepted, appinstalled event will fire soon.
      // If not, keep button visible.
      if (choice && choice.outcome === "accepted") {
        // just in case: optimistic UI
        // (real hide happens in appinstalled)
        const b = $("#btnInstall");
        if (b) b.classList.add("ghost");
      }
    } catch (_) {
      deferredPrompt = null;
    } finally {
      refreshInstallButtonState();
    }
  };

  // ===== Init =====
  const saved = getLang();
  setLang(saved);

  const y = $("#y");
  if (y) y.textContent = String(new Date().getFullYear());

  // Buttons
  $("#btnRequest")?.addEventListener("click", () => openTelegram(buildMessage(null)));
  $("#btnSend")?.addEventListener("click", () => openTelegram(buildMessage(null)));

  $("#btnCopy")?.addEventListener("click", async () => {
    const text = buildMessage(null);
    const ok = await writeClipboard(text);
    toast(ok ? t("toast_copied") : "Copy failed");
  });

  $$(".priceCard .btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pkg = btn.getAttribute("data-pkg") || null;
      openTelegram(buildMessage(pkg));
    });
  });

  $("#btnPay")?.addEventListener("click", openPay);
  $("#btnPay2")?.addEventListener("click", openPay);
  $("#mobPay")?.addEventListener("click", openPay);

  modal?.addEventListener("click", (e) => {
    const target = e.target;
    if (target && (target.matches("[data-close]") || target.closest("[data-close]"))) closePay();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("show")) closePay();
  });

  $("#btnInstall")?.addEventListener("click", installApp);
  $$(".chip").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

  // On load: hide install if already installed
  refreshInstallButtonState();

  // Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // Safe path: always resolve from current origin
      const swUrl = new URL("/sw.js", location.origin).toString();
      navigator.serviceWorker.register(swUrl).catch(() => {});
    });
  }

  // ===== Lead form -> Apps Script (submitLead) =====
  const crmCfg = window.K2_CRM || {};
  const scriptUrl = (crmCfg.SCRIPT_URL || "").replace(/\/$/, "");
  const form = $("#leadForm");
  const btn = $("#btnSubmitLead");
  const sendTg = $("#btnSendTg2");

  const buildMsgFromForm = () => {
    if (!form) return `👋 ${cfg.projectName} Anfrage (Form)`;
    const fd = new FormData(form);
    const obj = Object.fromEntries(fd.entries());
    const lines = [
      `👋 ${cfg.projectName} Anfrage (Form)`,
      obj.carModel ? `🚗 Auto: ${obj.carModel}` : null,
      obj.name ? `👤 Name: ${obj.name}` : null,
      obj.phone ? `📞 Telefon: ${obj.phone}` : null,
      obj.email ? `✉️ Email: ${obj.email}` : null,
      obj.message ? `📝 Nachricht: ${obj.message}` : null,
      `—`,
      `Bitte цену/срок + что нужно для заказа.`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  sendTg?.addEventListener("click", () => openTelegram(buildMsgFromForm()));

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!scriptUrl || scriptUrl.startsWith("PASTE_")) {
        toast(t("toast_form_not_ready"));
        return;
      }

      const fd = new FormData(form);
      fd.set("lang", getLang());
      fd.set("source", location.href);

      if (btn) btn.disabled = true;

      try {
        const res = await fetch(scriptUrl + "?action=submitLead", { method: "POST", body: fd });
        const json = await res.json().catch(() => null);
        if (json && json.ok) {
          toast(t("toast_sent"));
          form.reset();
        } else {
          toast(t("toast_send_fail"));
        }
      } catch (_) {
        toast(t("toast_network_fail"));
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }
})();
