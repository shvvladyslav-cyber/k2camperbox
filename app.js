/* app.js — K2 CamperBox (premium + robust)
   - i18n DE/UA/RU (включая плейсхолдеры)
   - Кнопки с иконками (Telegram / Revolut / Install) без правок HTML
   - Telegram: открывает share-ссылку с ПРЕДзаполненным текстом + копирует в буфер
   - PWA install: кнопка скрывается, если приложение уже установлено/запущено как standalone
   - Revolut QR modal
   - Lead form -> Apps Script (submitLead)
   - Service Worker register: /sw.js + fallback ./sw.js
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

  /* ----------------------------- i18n ----------------------------- */

  const i18n = {
    de: {
      // nav
      nav_models: "Modelle",
      nav_packages: "Pakete",
      nav_gallery: "Galerie",
      nav_faq: "FAQ",
      nav_cfg: "Konfigurator",
      nav_cab: "Cabinet",
      nav_contact: "Kontakt",

      // hero
      hero_badge: "🇩🇪 Kassel • Deutschland • Lieferung/Einbau",
      hero_title: "K2 CamperBox — dein Auto in 5 Minuten zum Camper",
      hero_lead:
        "Modulares Camping-System für Hochdachkombis (Caddy / Berlingo / Combo / Doblo / Tourneo / …). Schnell anfragen in Telegram + bequeme Bezahlung über Revolut QR.",
      cta_request: "Anfrage in Telegram",
      cta_pay: "Revolut QR bezahlen",
      cta_install: "App installieren",

      mini_1_k: "Schnell",
      mini_1_v: "Aufbau 5–10 Min",
      mini_2_k: "Modular",
      mini_2_v: "Boxen / Bett / Küche",
      mini_3_k: "Praktisch",
      mini_3_v: "Für Alltag & Reise",

      // hero card
      hero_card_title: "Sofort-Angebot",
      hero_card_pill: "Heute antworten",
      hero_card_model: "Auto/Modell",
      hero_card_wishes: "Wünsche",
      hero_card_send: "In Telegram senden",
      hero_card_copy: "Text kopieren",
      hero_card_hint:
        "Tipp: Wenn Telegram nicht öffnet — kopiere den Text und sende ihn an @k2camperbox.",

      // stats
      stat_1: "3 Sprachen",
      stat_2: "als App installierbar",
      stat_3: "Revolut Bezahlung",

      // models
      models_title: "Für welche Autos?",
      models_sub: "Hochdachkombis & kompakte Vans — wir passen das Modul an.",
      models_1: "Caddy / Caddy Maxi — Alltag + Reise.",
      models_2: "Berlingo / Rifter / Partner — modulare Boxen.",
      models_3: "Combo / Doblo / Tourneo / Kangoo / …",

      // packages
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

      // gallery
      gallery_title: "Galerie (Platzhalter)",
      gallery_sub: "Tausche diese Bilder gegen deine echten Fotos (siehe Anleitung unten).",
      gallery_note:
        "Foto-Dateien: /assets/gallery-1.jpg … /assets/gallery-4.jpg (du kannst deine hochladen).",

      // faq
      faq_title: "FAQ",
      faq_sub: "Kurz & ehrlich — für Einsteiger.",
      faq_q1: "Wie schnell kann ich bestellen?",
      faq_a1: "Schreib in Telegram, wir klären Auto + Optionen. Danach bekommst du Preis & сроки.",
      faq_q2: "Kann ich mit Revolut bezahlen?",
      faq_a2: "Ja. Klicke „Revolut QR bezahlen“ — QR öffnet sich. In Revolut scannen und zahlen.",
      faq_q3: "App installieren?",
      faq_a3:
        "Öffne die Website in Chrome → „App installieren“. Oder klicke den Button „App installieren“.",

      // form
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

      // contact
      contact_title: "Kontakt",
      contact_sub: "Alles klickbar: Telegram • Telefon • Email • Zahlung.",
      contact_phone: "Telefon",
      contact_pay: "Bezahlen",
      contact_pay_sub: "Revolut QR",
      footer_top: "Nach oben",

      // pay modal
      pay_title: "Revolut QR bezahlen",
      pay_hint: "Revolut öffnen → Scan → QR scannen → bezahlen.",
      pay_to: "Empfänger:",
      pay_note: "Kommentar:",
      pay_replace:
        "Wichtig: Das ist ein Demo-QR. Ersetze /assets/revolut-qr.png mit deinem echten Revolut-QR.",
      pay_download: "QR herunterladen",
      pay_close: "Schließen",

      // mobile bar
      mob_request: "Anfrage",
      mob_pay: "QR",
      mob_cfg: "LEGO",
      mob_cab: "Cabinet",

      // toasts
      toast_copied: "Kopiert ✅",
      toast_install_hint: "Chrome → Menü → App installieren",
      toast_sent: "Gesendet ✅",
      toast_error: "Fehler ❌",

      // placeholders
      ph_carModel: "z.B. VW Caddy Maxi",
      ph_wishes: "Bett, Küche, Stauraum, Budget…",
      ph_name: "Max",
      ph_phone: "+49 ...",
      ph_email: "you@mail.com",
      ph_form_car: "VW Caddy Maxi",
      ph_form_msg: "Bett/Küche/Budget/...",
    },

    ua: {
      // nav
      nav_models: "Авто",
      nav_packages: "Пакети",
      nav_gallery: "Галерея",
      nav_faq: "FAQ",
      nav_cfg: "Конфігуратор",
      nav_cab: "Кабінет",
      nav_contact: "Контакти",

      // hero
      hero_badge: "🇩🇪 Кассель • Німеччина • Доставка/монтаж",
      hero_title: "K2 CamperBox — перетвори авто на кемпер за 5 хвилин",
      hero_lead:
        "Модульна система для мінівенів/«каблучків» (Caddy / Berlingo / Combo / Doblo / Tourneo / …). Швидка заявка в Telegram + оплата через Revolut QR.",
      cta_request: "Заявка в Telegram",
      cta_pay: "Оплатити Revolut QR",
      cta_install: "Встановити додаток",

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
      hero_card_hint:
        "Порада: якщо Telegram не відкрився — скопіюй текст і надішли @k2camperbox.",

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
      gallery_note:
        "Файли фото: /assets/gallery-1.jpg … /assets/gallery-4.jpg (можеш залити свої).",

      faq_title: "FAQ",
      faq_sub: "Коротко і по-людськи — для новачків.",
      faq_q1: "Як швидко можна замовити?",
      faq_a1: "Напиши в Telegram, уточнимо авто + опції. Потім ціна і строки.",
      faq_q2: "Можна оплатити через Revolut?",
      faq_a2: "Так. Натисни «Оплатити Revolut QR» — відкриється QR. Скануй у Revolut і плати.",
      faq_q3: "Як встановити додаток?",
      faq_a3:
        "Відкрий сайт у Chrome → «Встановити». Або натисни кнопку «Встановити додаток».",

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
      pay_replace:
        "Важливо: це демо QR. Заміни /assets/revolut-qr.png на твій реальний QR з Revolut.",
      pay_download: "Завантажити QR",
      pay_close: "Закрити",

      mob_request: "Заявка",
      mob_pay: "QR",
      mob_cfg: "LEGO",
      mob_cab: "Кабінет",

      toast_copied: "Скопійовано ✅",
      toast_install_hint: "Chrome → меню → Встановити",
      toast_sent: "Надіслано ✅",
      toast_error: "Помилка ❌",

      ph_carModel: "напр. VW Caddy Maxi",
      ph_wishes: "Ліжко, кухня, зберігання, бюджет…",
      ph_name: "Макс",
      ph_phone: "+49 ...",
      ph_email: "you@mail.com",
      ph_form_car: "VW Caddy Maxi",
      ph_form_msg: "Ліжко/кухня/бюджет/...",
    },

    ru: {
      // nav
      nav_models: "Авто",
      nav_packages: "Пакеты",
      nav_gallery: "Галерея",
      nav_faq: "FAQ",
      nav_cfg: "Конфигуратор",
      nav_cab: "Кабинет",
      nav_contact: "Контакты",

      // hero
      hero_badge: "🇩🇪 Кассель • Германия • Доставка/установка",
      hero_title: "K2 CamperBox — превращаем авто в кемпер за 5 минут",
      hero_lead:
        "Модульная система для «каблучков» и компактных ванов (Caddy / Berlingo / Combo / Doblo / Tourneo / …). Быстрая заявка в Telegram + оплата через Revolut QR.",
      cta_request: "Заявка в Telegram",
      cta_pay: "Оплата Revolut QR",
      cta_install: "Установить приложение",

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
      hero_card_hint:
        "Подсказка: если Telegram не открылся — скопируй текст и отправь @k2camperbox.",

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
      gallery_note:
        "Файлы фото: /assets/gallery-1.jpg … /assets/gallery-4.jpg (можешь загрузить свои).",

      faq_title: "FAQ",
      faq_sub: "Коротко и по-человечески — для чайника.",
      faq_q1: "Как быстро можно заказать?",
      faq_a1: "Напиши в Telegram, уточним авто + опции. Потом цена и сроки.",
      faq_q2: "Можно оплатить Revolut?",
      faq_a2:
        "Да. Нажми «Оплата Revolut QR» — откроется окно с QR. Сканируешь в Revolut и оплачиваешь.",
      faq_q3: "Как установить приложение?",
      faq_a3:
        "Открой сайт в Chrome → «Установить приложение». Или нажми кнопку «Установить приложение».",

      form_title: "Форма заявки",
      form_sub: "Отправка заявки в Google Sheets (через Apps Script).",
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
      pay_replace:
        "Важно: это демо QR. Замени /assets/revolut-qr.png на свой реальный QR из Revolut.",
      pay_download: "Скачать QR",
      pay_close: "Закрыть",

      mob_request: "Заявка",
      mob_pay: "QR",
      mob_cfg: "LEGO",
      mob_cab: "Кабинет",

      toast_copied: "Скопировано ✅",
      toast_install_hint: "Chrome → меню → Установить приложение",
      toast_sent: "Отправлено ✅",
      toast_error: "Ошибка ❌",

      ph_carModel: "например, VW Caddy Maxi",
      ph_wishes: "Кровать, кухня, хранение, бюджет…",
      ph_name: "Макс",
      ph_phone: "+49 ...",
      ph_email: "you@mail.com",
      ph_form_car: "VW Caddy Maxi",
      ph_form_msg: "Кровать/кухня/бюджет/...",
    },
  };

  const getLang = () => localStorage.getItem("k2_lang") || "de";
  const tr = (key, lang = getLang()) => (i18n[lang] && i18n[lang][key]) || (i18n.de && i18n.de[key]) || "";

  /* ----------------------------- toast ----------------------------- */

  const toast = (msg) => {
    let t = $("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.style.cssText =
        "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);padding:10px 12px;border-radius:12px;border:1px solid rgba(36,48,95,.8);background:rgba(11,18,48,.92);backdrop-filter: blur(10px);font-weight:800;z-index:120;opacity:0;transition:opacity .15s ease;max-width:min(92vw,520px);text-align:center";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(toast._tm);
    toast._tm = setTimeout(() => (t.style.opacity = "0"), 1400);
  };

  /* ----------------------------- premium icons (no HTML edits) ----------------------------- */

  const ICONS = {
    telegram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.8 4.2c.4-.2.3-.8-.1-.9-.5-.2-1.2-.1-2 .2L3.4 10.2c-.8.3-1.3.6-1.5.9-.3.6.2 1.1 1 1.4l4.1 1.3 1.6 5c.2.7 1 .9 1.5.4l2.3-2.2 4.2 3.1c.7.5 1.7.1 1.9-.8L22 5.3c.1-.5 0-.9-.2-1.1ZM9.4 13.6l9.6-7.2-7.6 8.8-.3 3.2-1.4-4.4-.3-.1Z"/></svg>',
    pay:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5C3 6.1 4.1 5 5.5 5h13C20.9 5 22 6.1 22 7.5v9C22 17.9 20.9 19 19.5 19h-14C4.1 19 3 17.9 3 16.5v-9Zm2 0v.5h15V7.5a.5.5 0 0 0-.5-.5h-14a.5.5 0 0 0-.5.5Zm0 3V16.5c0 .3.2.5.5.5h14c.3 0 .5-.2.5-.5V10.5H5Zm2.2 4.2h6.6v1.6H7.2v-1.6ZM16 14h2.8v2H16v-2Z"/></svg>',
    install:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L11 12.6V4a1 1 0 0 1 1-1Zm-7 15a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/></svg>',
  };

  // Добавляет <span class="btnIcon"> + <span class="btnText">...</span>
  const enhanceButton = (btn, iconSvg) => {
    if (!btn) return;
    if (btn.dataset.enhanced === "1") return;

    const text = btn.textContent || "";
    btn.textContent = "";
    const icon = document.createElement("span");
    icon.className = "btnIcon";
    icon.innerHTML = iconSvg || "";
    const span = document.createElement("span");
    span.className = "btnText";
    span.textContent = text.trim();

    // inline styles (чтобы заработало даже если CSS не обновлял)
    btn.style.display = btn.style.display || "inline-flex";
    btn.style.alignItems = btn.style.alignItems || "center";
    btn.style.gap = btn.style.gap || "10px";

    // чуть «премиум»: иконка как бейдж (без перегруза)
    icon.style.cssText =
      "display:inline-grid;place-items:center;width:18px;height:18px;opacity:.95";
    // подстраховка размеров svg
    const svg = icon.querySelector("svg");
    if (svg) svg.style.cssText = "width:18px;height:18px;display:block";

    btn.appendChild(icon);
    btn.appendChild(span);
    btn.dataset.enhanced = "1";
  };

  /* ----------------------------- i18n apply (text + placeholders) ----------------------------- */

  const setText = (el, value) => {
    if (!el) return;
    // если это «иконифицированная» кнопка — меняем только текст
    const t = el.querySelector && el.querySelector(".btnText");
    if (t) t.textContent = value;
    else el.textContent = value;
  };

  const applyPlaceholders = (lang) => {
    const map = [
      ["#carModel", "ph_carModel"],
      ["#wishes", "ph_wishes"],
      ['#leadForm input[name="name"]', "ph_name"],
      ['#leadForm input[name="phone"]', "ph_phone"],
      ['#leadForm input[name="email"]', "ph_email"],
      ['#leadForm input[name="carModel"]', "ph_form_car"],
      ['#leadForm textarea[name="message"]', "ph_form_msg"],
    ];
    for (const [sel, key] of map) {
      const el = $(sel);
      if (el) el.setAttribute("placeholder", tr(key, lang));
    }
  };

  const setLang = (lang) => {
    const normalized = lang === "ua" ? "uk" : lang;
    document.documentElement.lang = normalized;

    $$(".chip").forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = tr(key, lang);
      if (value) setText(el, value);
    });

    applyPlaceholders(lang);
    localStorage.setItem("k2_lang", lang);
  };

  /* ----------------------------- telegram (prefilled) ----------------------------- */

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
      `Bitte Preis/Termin + was für die Bestellung benötigt wird.`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const openTelegram = (text) => {
    // 1) копируем в буфер (помогает если Telegram не подхватил)
    try {
      navigator.clipboard?.writeText(text).catch(() => {});
    } catch (_) {}

    // 2) открываем share-url с предзаполненным текстом
    const share = `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
    const w = window.open(share, "_blank", "noopener");
    if (!w) window.location.href = share; // если блок popup — открываем в текущей вкладке
  };

  /* ----------------------------- modal ----------------------------- */

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

  /* ----------------------------- PWA install button logic ----------------------------- */

  const isStandalone = () => {
    // Android/Chrome
    const m = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    // iOS Safari
    const ios = "standalone" in navigator && navigator.standalone;
    return Boolean(m || ios);
  };

  const setInstallVisible = (visible) => {
    const b = $("#btnInstall");
    if (!b) return;
    b.style.display = visible ? "" : "none";
  };

  let deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // показываем кнопку только если НЕ standalone
    if (!isStandalone()) setInstallVisible(true);
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    setInstallVisible(false);
  });

  const installApp = async () => {
    if (isStandalone()) {
      setInstallVisible(false);
      return;
    }
    if (!deferredPrompt) {
      toast(tr("toast_install_hint"));
      return;
    }
    deferredPrompt.prompt();
    try {
      const choice = await deferredPrompt.userChoice;
      // если установил — прячем
      if (choice && choice.outcome === "accepted") setInstallVisible(false);
    } catch (_) {}
    deferredPrompt = null;
  };

  /* ----------------------------- micro ripple (fast, lightweight) ----------------------------- */

  const attachRipple = () => {
    const buttons = $$(".btn, .contactCard, .chip");
    buttons.forEach((el) => {
      if (el.dataset.ripple === "1") return;
      el.dataset.ripple = "1";
      el.style.position = el.style.position || "relative";
      el.style.overflow = el.style.overflow || "hidden";

      el.addEventListener(
        "pointerdown",
        (e) => {
          // очень легкий ripple без canvas
          const rect = el.getBoundingClientRect();
          const d = Math.max(rect.width, rect.height);
          const x = (e.clientX - rect.left) - d / 2;
          const y = (e.clientY - rect.top) - d / 2;

          const r = document.createElement("span");
          r.style.cssText =
            `position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:999px;` +
            `background:rgba(255,255,255,.18);transform:scale(0);opacity:1;pointer-events:none;` +
            `transition:transform .55s ease, opacity .75s ease;`;
          el.appendChild(r);
          requestAnimationFrame(() => {
            r.style.transform = "scale(1)";
            r.style.opacity = "0";
          });
          setTimeout(() => r.remove(), 900);
        },
        { passive: true }
      );
    });
  };

  /* ----------------------------- SW register ----------------------------- */

  const registerSW = async () => {
    if (!("serviceWorker" in navigator)) return;
    try {
      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    } catch (e1) {
      try {
        await navigator.serviceWorker.register("./sw.js");
      } catch (_) {
        // тихо
      }
    }
  };

  /* ----------------------------- init ----------------------------- */

  const init = () => {
    // Иконки в главных CTA
    enhanceButton($("#btnRequest"), ICONS.telegram);
    enhanceButton($("#btnPay"), ICONS.pay);
    enhanceButton($("#btnInstall"), ICONS.install);

    // Также можно «иконифицировать» мобильный QR (не трогаем текст)
    enhanceButton($("#mobPay"), ICONS.pay);

    // Языки
    setLang(getLang());

    // Год в футере
    const y = $("#y");
    if (y) y.textContent = String(new Date().getFullYear());

    // Ripple/micro
    attachRipple();

    // Скрываем install, если уже standalone
    setInstallVisible(!isStandalone());

    // Events: telegram
    $("#btnRequest")?.addEventListener("click", () => openTelegram(buildMessage(null)));
    $("#btnSend")?.addEventListener("click", () => openTelegram(buildMessage(null)));

    $("#btnCopy")?.addEventListener("click", async () => {
      const text = buildMessage(null);
      try {
        await navigator.clipboard.writeText(text);
        toast(tr("toast_copied"));
      } catch (_) {
        toast(tr("toast_error"));
      }
    });

    $$(".priceCard .btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pkg = btn.getAttribute("data-pkg") || null;
        openTelegram(buildMessage(pkg));
      });
    });

    // pay modal
    $("#btnPay")?.addEventListener("click", openPay);
    $("#btnPay2")?.addEventListener("click", openPay);
    $("#mobPay")?.addEventListener("click", openPay);

    modal?.addEventListener("click", (e) => {
      const t = e.target;
      if (t && (t.matches("[data-close]") || t.closest("[data-close]"))) closePay();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal?.classList.contains("show")) closePay();
    });

    // install
    $("#btnInstall")?.addEventListener("click", installApp);

    // lang chips
    $$(".chip").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

    // SW
    window.addEventListener("load", registerSW);
  };

  // DOM ready
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* ----------------------------- Lead form -> Apps Script (submitLead) ----------------------------- */
(() => {
  "use strict";

  const form = document.getElementById("leadForm");
  if (!form) return;

  const btn = document.getElementById("btnSubmitLead");
  const sendTg = document.getElementById("btnSendTg2");

  const getLang = () => localStorage.getItem("k2_lang") || "de";

  const toast = (msg) => {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.style.cssText =
        "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);padding:10px 12px;border-radius:12px;border:1px solid rgba(36,48,95,.8);background:rgba(11,18,48,.92);backdrop-filter: blur(10px);font-weight:800;z-index:120;opacity:0;transition:opacity .15s ease;max-width:min(92vw,520px);text-align:center";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(toast._tm);
    toast._tm = setTimeout(() => (t.style.opacity = "0"), 1400);
  };

  // CRM config
  const cfg = window.K2_CRM || {};
  const scriptUrl = (cfg.SCRIPT_URL || "").replace(/\/$/, "");

  const buildMsgFromForm = () => {
    const fd = new FormData(form);
    const obj = Object.fromEntries(fd.entries());
    const lines = [
      `👋 K2 CamperBox Anfrage (Form)`,
      obj.carModel ? `🚗 Auto: ${obj.carModel}` : null,
      obj.name ? `👤 Name: ${obj.name}` : null,
      obj.phone ? `📞 Telefon: ${obj.phone}` : null,
      obj.email ? `✉️ Email: ${obj.email}` : null,
      obj.message ? `📝 Nachricht: ${obj.message}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const openTelegram = (text) => {
    try {
      navigator.clipboard?.writeText(text).catch(() => {});
    } catch (_) {}
    const share = `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
    const w = window.open(share, "_blank", "noopener");
    if (!w) window.location.href = share;
  };

  if (sendTg) {
    sendTg.addEventListener("click", () => openTelegram(buildMsgFromForm()));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!scriptUrl || scriptUrl.indexOf("PASTE_") === 0) {
      toast("Форма не настроена (SCRIPT_URL). Используй Telegram.");
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
        toast("Заявка отправлена ✅");
        form.reset();
      } else {
        toast("Ошибка отправки ❌");
      }
    } catch (_) {
      toast("Ошибка сети/скрипта ❌");
    } finally {
      if (btn) btn.disabled = false;
    }
  });
})();
