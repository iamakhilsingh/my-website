(function () {
  "use strict";

  const countryNames = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Cote d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Other / Not listed"
  ];

  const countryCallingCodes = {
    "Afghanistan": "+93",
    "Albania": "+355",
    "Algeria": "+213",
    "Andorra": "+376",
    "Angola": "+244",
    "Antigua and Barbuda": "+1",
    "Argentina": "+54",
    "Armenia": "+374",
    "Australia": "+61",
    "Austria": "+43",
    "Azerbaijan": "+994",
    "Bahamas": "+1",
    "Bahrain": "+973",
    "Bangladesh": "+880",
    "Barbados": "+1",
    "Belarus": "+375",
    "Belgium": "+32",
    "Belize": "+501",
    "Benin": "+229",
    "Bhutan": "+975",
    "Bolivia": "+591",
    "Bosnia and Herzegovina": "+387",
    "Botswana": "+267",
    "Brazil": "+55",
    "Brunei": "+673",
    "Bulgaria": "+359",
    "Burkina Faso": "+226",
    "Burundi": "+257",
    "Cabo Verde": "+238",
    "Cambodia": "+855",
    "Cameroon": "+237",
    "Canada": "+1",
    "Central African Republic": "+236",
    "Chad": "+235",
    "Chile": "+56",
    "China": "+86",
    "Colombia": "+57",
    "Comoros": "+269",
    "Congo": "+242",
    "Costa Rica": "+506",
    "Cote d'Ivoire": "+225",
    "Croatia": "+385",
    "Cuba": "+53",
    "Cyprus": "+357",
    "Czechia": "+420",
    "Democratic Republic of the Congo": "+243",
    "Denmark": "+45",
    "Djibouti": "+253",
    "Dominica": "+1",
    "Dominican Republic": "+1",
    "Ecuador": "+593",
    "Egypt": "+20",
    "El Salvador": "+503",
    "Equatorial Guinea": "+240",
    "Eritrea": "+291",
    "Estonia": "+372",
    "Eswatini": "+268",
    "Ethiopia": "+251",
    "Fiji": "+679",
    "Finland": "+358",
    "France": "+33",
    "Gabon": "+241",
    "Gambia": "+220",
    "Georgia": "+995",
    "Germany": "+49",
    "Ghana": "+233",
    "Greece": "+30",
    "Grenada": "+1",
    "Guatemala": "+502",
    "Guinea": "+224",
    "Guinea-Bissau": "+245",
    "Guyana": "+592",
    "Haiti": "+509",
    "Honduras": "+504",
    "Hungary": "+36",
    "Iceland": "+354",
    "India": "+91",
    "Indonesia": "+62",
    "Iran": "+98",
    "Iraq": "+964",
    "Ireland": "+353",
    "Israel": "+972",
    "Italy": "+39",
    "Jamaica": "+1",
    "Japan": "+81",
    "Jordan": "+962",
    "Kazakhstan": "+7",
    "Kenya": "+254",
    "Kiribati": "+686",
    "Kuwait": "+965",
    "Kyrgyzstan": "+996",
    "Laos": "+856",
    "Latvia": "+371",
    "Lebanon": "+961",
    "Lesotho": "+266",
    "Liberia": "+231",
    "Libya": "+218",
    "Liechtenstein": "+423",
    "Lithuania": "+370",
    "Luxembourg": "+352",
    "Madagascar": "+261",
    "Malawi": "+265",
    "Malaysia": "+60",
    "Maldives": "+960",
    "Mali": "+223",
    "Malta": "+356",
    "Marshall Islands": "+692",
    "Mauritania": "+222",
    "Mauritius": "+230",
    "Mexico": "+52",
    "Micronesia": "+691",
    "Moldova": "+373",
    "Monaco": "+377",
    "Mongolia": "+976",
    "Montenegro": "+382",
    "Morocco": "+212",
    "Mozambique": "+258",
    "Myanmar": "+95",
    "Namibia": "+264",
    "Nauru": "+674",
    "Nepal": "+977",
    "Netherlands": "+31",
    "New Zealand": "+64",
    "Nicaragua": "+505",
    "Niger": "+227",
    "Nigeria": "+234",
    "North Korea": "+850",
    "North Macedonia": "+389",
    "Norway": "+47",
    "Oman": "+968",
    "Pakistan": "+92",
    "Palau": "+680",
    "Palestine": "+970",
    "Panama": "+507",
    "Papua New Guinea": "+675",
    "Paraguay": "+595",
    "Peru": "+51",
    "Philippines": "+63",
    "Poland": "+48",
    "Portugal": "+351",
    "Qatar": "+974",
    "Romania": "+40",
    "Russia": "+7",
    "Rwanda": "+250",
    "Saint Kitts and Nevis": "+1",
    "Saint Lucia": "+1",
    "Saint Vincent and the Grenadines": "+1",
    "Samoa": "+685",
    "San Marino": "+378",
    "Sao Tome and Principe": "+239",
    "Saudi Arabia": "+966",
    "Senegal": "+221",
    "Serbia": "+381",
    "Seychelles": "+248",
    "Sierra Leone": "+232",
    "Singapore": "+65",
    "Slovakia": "+421",
    "Slovenia": "+386",
    "Solomon Islands": "+677",
    "Somalia": "+252",
    "South Africa": "+27",
    "South Korea": "+82",
    "South Sudan": "+211",
    "Spain": "+34",
    "Sri Lanka": "+94",
    "Sudan": "+249",
    "Suriname": "+597",
    "Sweden": "+46",
    "Switzerland": "+41",
    "Syria": "+963",
    "Taiwan": "+886",
    "Tajikistan": "+992",
    "Tanzania": "+255",
    "Thailand": "+66",
    "Timor-Leste": "+670",
    "Togo": "+228",
    "Tonga": "+676",
    "Trinidad and Tobago": "+1",
    "Tunisia": "+216",
    "Turkey": "+90",
    "Turkmenistan": "+993",
    "Tuvalu": "+688",
    "Uganda": "+256",
    "Ukraine": "+380",
    "United Arab Emirates": "+971",
    "United Kingdom": "+44",
    "United States": "+1",
    "Uruguay": "+598",
    "Uzbekistan": "+998",
    "Vanuatu": "+678",
    "Vatican City": "+379",
    "Venezuela": "+58",
    "Vietnam": "+84",
    "Yemen": "+967",
    "Zambia": "+260",
    "Zimbabwe": "+263"
  };

  const whatsappNumber = ["91", "783", "824", "7423"].join("");
  const defaultMessage =
    "Hello MedTreat India, I would like guidance for treatment options in India.";
  const googleSheetEndpoint = "https://script.google.com/macros/s/AKfycbzGC-vCT-8dA3CzxhRDYMbEfZSSZwQB-ezj-3OleiSdVCFXSoGdGtU0En8waN4DTPEJLA/exec";

  function whatsappUrl(message) {
    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message || defaultMessage);
  }

  function populateCountries() {
    document.querySelectorAll("[data-country-select]").forEach((select) => {
      const selected = select.value;
      countryNames.forEach((country) => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        select.appendChild(option);
      });
      select.value = selected;
    });
  }

  function callingCodeFor(country) {
    return countryCallingCodes[country] || "";
  }

  function normalizedPhone(form) {
    const data = new FormData(form);
    const phoneCode = String(data.get("phoneCode") || callingCodeFor(data.get("country")) || "").trim();
    const phone = String(data.get("phone") || "").trim();
    return [phoneCode, phone].filter(Boolean).join(" ");
  }

  function formMessage(form) {
    const data = new FormData(form);
    const lines = [
      "Hello MedTreat India, I would like guidance for treatment options in India.",
      "",
      "Name: " + (data.get("name") || ""),
      "Country: " + (data.get("country") || ""),
      "Patient contact: " + normalizedPhone(form),
      "Email: " + (data.get("email") || ""),
      "Treatment need: " + (data.get("treatment") || ""),
      "Message: " + (data.get("message") || "")
    ];

    if (data.get("budget")) {
      lines.push("Estimated budget: " + data.get("budget"));
    }

    if (data.get("date")) {
      lines.push("Preferred travel date: " + data.get("date"));
    }

    return lines.join("\n");
  }

  function formPayload(form) {
    const data = new FormData(form);
    const phoneCode = String(data.get("phoneCode") || callingCodeFor(data.get("country")) || "").trim();
    const localPhone = String(data.get("phone") || "").trim();
    return {
      submittedAt: new Date().toISOString(),
      sourcePage: window.location.href,
      name: String(data.get("name") || "").trim(),
      country: String(data.get("country") || "").trim(),
      phoneCode: phoneCode,
      phone: [phoneCode, localPhone].filter(Boolean).join(" "),
      localPhone: localPhone,
      email: String(data.get("email") || "").trim(),
      treatment: String(data.get("treatment") || "").trim(),
      message: String(data.get("message") || "").trim(),
      budget: String(data.get("budget") || "").trim(),
      date: String(data.get("date") || "").trim()
    };
  }

  function googleSheetReady() {
    return /^https:\/\/script\.google\.com\/macros\/s\//.test(googleSheetEndpoint);
  }

  function setFormStatus(form, message, type) {
    let status = form.querySelector("[data-form-status]");
    if (!status) {
      status = document.createElement("p");
      status.setAttribute("data-form-status", "");
      status.className = "form-status";
      form.appendChild(status);
    }
    status.textContent = message;
    status.dataset.status = type || "info";
  }

  function submitToGoogleSheet(form) {
    return fetch(googleSheetEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(formPayload(form))
    });
  }

  function openPreparedWhatsApp(url, openedWindow) {
    if (openedWindow && !openedWindow.closed) {
      openedWindow.location.href = url;
      return;
    }

    window.location.href = url;
  }

  function ensurePhoneCodeField(form) {
    const phoneInput = form.querySelector("input[name='phone']");
    if (!phoneInput) return;

    phoneInput.setAttribute("inputmode", "numeric");
    phoneInput.setAttribute("pattern", "[0-9]{6,15}");
    phoneInput.setAttribute("maxlength", "15");
    phoneInput.setAttribute("placeholder", "Phone number");
    phoneInput.setAttribute("title", "Use digits only. Do not add spaces, letters, + sign, or symbols.");

    let hiddenCode = form.querySelector("input[name='phoneCode']");
    if (!hiddenCode) {
      hiddenCode = document.createElement("input");
      hiddenCode.type = "hidden";
      hiddenCode.name = "phoneCode";
      form.appendChild(hiddenCode);
    }

    if (!phoneInput.closest(".phone-composite")) {
      const wrapper = document.createElement("span");
      wrapper.className = "phone-composite";
      const code = document.createElement("span");
      code.className = "phone-code";
      code.setAttribute("data-phone-code", "");
      code.textContent = "+";
      phoneInput.parentNode.insertBefore(wrapper, phoneInput);
      wrapper.appendChild(code);
      wrapper.appendChild(phoneInput);
    }
  }

  function updatePhoneCode(form) {
    const country = form.querySelector("[data-country-select]")?.value || "";
    const code = callingCodeFor(country);
    const codeLabel = form.querySelector("[data-phone-code]");
    const hiddenCode = form.querySelector("input[name='phoneCode']");

    if (codeLabel) codeLabel.textContent = code || "+";
    if (hiddenCode) hiddenCode.value = code;
  }

  function validatePhoneInput(input) {
    const value = input.value.trim();
    if (!value) {
      input.setCustomValidity("Please enter your phone or WhatsApp number.");
    } else if (!/^[0-9]+$/.test(value)) {
      input.setCustomValidity("Phone number can use digits only. Please remove letters, spaces, + sign, or symbols.");
    } else if (value.length < 6 || value.length > 15) {
      input.setCustomValidity("Please enter a valid phone number with 6 to 15 digits.");
    } else {
      input.setCustomValidity("");
    }

    input.toggleAttribute("aria-invalid", Boolean(input.validationMessage));
    return input.validationMessage === "";
  }

  function validateEmailInput(input) {
    const value = input.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    input.setCustomValidity(isValid ? "" : "Please enter a valid email address, for example name@example.com.");
    input.toggleAttribute("aria-invalid", Boolean(input.validationMessage));
    return input.validationMessage === "";
  }

  function validateFormFields(form) {
    const phoneInput = form.querySelector("input[name='phone']");
    const emailInput = form.querySelector("input[name='email']");
    if (phoneInput) validatePhoneInput(phoneInput);
    if (emailInput) validateEmailInput(emailInput);
  }

  function setupFormValidation(form) {
    ensurePhoneCodeField(form);
    updatePhoneCode(form);

    const countrySelect = form.querySelector("[data-country-select]");
    const phoneInput = form.querySelector("input[name='phone']");
    const emailInput = form.querySelector("input[name='email']");

    countrySelect?.addEventListener("change", () => {
      updatePhoneCode(form);
      if (phoneInput?.value) validatePhoneInput(phoneInput);
    });

    phoneInput?.addEventListener("input", () => {
      validatePhoneInput(phoneInput);
    });

    emailInput?.addEventListener("input", () => {
      validateEmailInput(emailInput);
    });

    form.addEventListener("reset", () => {
      window.setTimeout(() => updatePhoneCode(form), 0);
    });
  }

  function setupForms() {
    document.querySelectorAll("[data-consult-form]").forEach((form) => {
      setupFormValidation(form);

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        validateFormFields(form);
        if (!form.reportValidity()) return;
        const message = formMessage(form);
        const targetUrl = whatsappUrl(message);
        const whatsappWindow = window.open("about:blank", "_blank");
        if (whatsappWindow) whatsappWindow.opener = null;
        const button = form.querySelector("button[type='submit']");
        if (button) button.disabled = true;
        setFormStatus(form, "Saving your details before opening WhatsApp...", "info");

        if (googleSheetReady()) {
          try {
            await submitToGoogleSheet(form);
            form.reset();
            setFormStatus(form, "Thank you. Your details have been saved. Opening WhatsApp...", "success");
            openPreparedWhatsApp(targetUrl, whatsappWindow);
          } catch (error) {
            if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close();
            setFormStatus(form, "The form could not save right now. Please try again or use the WhatsApp button.", "error");
          } finally {
            if (button) button.disabled = false;
          }
          return;
        }

        setFormStatus(form, "Google Sheet connection is not active yet. Opening WhatsApp instead.", "info");
        openPreparedWhatsApp(targetUrl, whatsappWindow);
        if (button) button.disabled = false;
      });
    });
  }

  function setupNavigation() {
    const button = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (!button || !nav) return;

    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        nav.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setupWhatsAppLinks() {
    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      link.setAttribute("href", whatsappUrl(defaultMessage));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function setupLanguageSelectors() {
    const languages = [
      ["", "Select Language"],
      ["en", "English"],
      ["fr", "French"],
      ["ar", "Arabic"],
      ["ru", "Russian"],
      ["bn", "Bengali"],
      ["hi", "Hindi"],
      ["ro", "Romanian"],
      ["es", "Spanish"],
      ["pt", "Portuguese"]
    ];
    const storageKey = "medtreatindia-language";
    const savedLanguage = window.localStorage.getItem(storageKey) || "";

    function createLanguageWidget(extraClass) {
      const wrapper = document.createElement("label");
      wrapper.className = "language-widget" + (extraClass ? " " + extraClass : "");
      wrapper.innerHTML = '<span>Language</span>';

      const select = document.createElement("select");
      select.setAttribute("aria-label", "Select website language");
      select.setAttribute("data-language-select", "");
      languages.forEach(([code, label]) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = label;
        select.appendChild(option);
      });
      select.value = savedLanguage;
      wrapper.appendChild(select);
      return wrapper;
    }

    document.querySelectorAll("[data-language-slot]").forEach((slot) => {
      if (!slot.querySelector("[data-language-select]")) {
        slot.appendChild(createLanguageWidget("language-widget-hero"));
      }
    });

    document.querySelectorAll("[data-language-select]").forEach((select) => {
      select.addEventListener("change", () => {
        const language = select.value;
        window.localStorage.setItem(storageKey, language);
        document.querySelectorAll("[data-language-select]").forEach((otherSelect) => {
          otherSelect.value = language;
        });
        if (!language || language === "en") return;

        const currentUrl = window.location.protocol === "file:"
          ? "https://www.medtreatindia.com/"
          : window.location.href;
        const translateUrl = "https://translate.google.com/translate?sl=auto&tl=" + encodeURIComponent(language) + "&u=" + encodeURIComponent(currentUrl);
        window.location.href = translateUrl;
      });
    });
  }

  function setupHospitalSliders() {
    document.querySelectorAll("[data-hospital-slider]").forEach((slider) => {
      const cards = Array.from(slider.querySelectorAll("article"));
      if (cards.length < 2) return;
      const showcase = slider.closest("[data-hospital-showcase]");
      const previousButton = showcase ? showcase.querySelector("[data-hospital-prev]") : null;
      const nextButton = showcase ? showcase.querySelector("[data-hospital-next]") : null;
      const slideDelay = 3000;

      let index = 0;
      let timer;

      function updateCards() {
        cards.forEach((card, cardIndex) => {
          const position = (cardIndex - index + cards.length) % cards.length;
          card.classList.remove("is-active", "is-prev", "is-next", "is-hidden");

          if (position === 0) {
            card.classList.add("is-active");
          } else if (position === 1) {
            card.classList.add("is-next");
          } else if (position === cards.length - 1) {
            card.classList.add("is-prev");
          } else {
            card.classList.add("is-hidden");
          }
        });
      }

      function goToCard(nextIndex) {
        index = (nextIndex + cards.length) % cards.length;
        updateCards();
      }

      function start() {
        stop();
        timer = window.setInterval(() => goToCard(index + 1), slideDelay);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      slider.addEventListener("focusin", stop);
      slider.addEventListener("focusout", start);
      if (previousButton) {
        previousButton.addEventListener("click", () => {
          stop();
          goToCard(index - 1);
          start();
        });
      }
      if (nextButton) {
        nextButton.addEventListener("click", () => {
          stop();
          goToCard(index + 1);
          start();
        });
      }
      updateCards();
      start();
    });
  }

  function setupTestimonialVideos() {
    document.querySelectorAll("[data-youtube-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const videoId = button.getAttribute("data-youtube-id");
        if (!videoId) return;

        const iframe = document.createElement("iframe");
        iframe.className = "testimonial-video";
        iframe.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=https%3A%2F%2Fmedtreatindia.com";
        iframe.title = "Mariam patient testimonial for knee and gallbladder treatment with MedTreat India";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        button.replaceWith(iframe);
      });
    });
  }

  function setupZoomReveal() {
    const selectors = [
      ".hero-copy > *",
      ".journey-card",
      ".consult-form > *",
      ".hero-actions > *",
      ".section-head",
      ".section > .container > *",
      ".mini-card-grid article",
      ".steps-row article",
      ".hospital-showcase",
      ".logo-marquee",
      ".testimonial-feature-card",
      ".testimonial-grid article",
      ".story-options a",
      ".treatment-directory article",
      ".security-card",
      ".content-card",
      ".image-card",
      ".cta-band h2",
      ".cta-band p",
      ".cta-band .hero-actions > *",
      ".footer-grid > *",
      ".footer-bottom",
      ".floating-wa"
    ];
    const elements = Array.from(document.querySelectorAll(selectors.join(","))).filter((element) => {
      return !element.closest("[data-zoom-reveal]") && !element.matches(".site-header, .site-header *");
    });

    document.body.classList.add("zoom-reveal-ready");

    elements.forEach((element, index) => {
      element.setAttribute("data-zoom-reveal", "");
      element.style.setProperty("--zoom-delay", Math.min(index % 6, 5) * 70 + "ms");
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-zoom-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-zoom-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function setupThemeToggle() {
    const toggle = document.querySelector("[data-theme-toggle]");
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const storageKey = "medtreatindia-theme";

    function preferredTheme() {
      const savedTheme = window.localStorage.getItem(storageKey);
      if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
      return mediaQuery.matches ? "dark" : "light";
    }

    function applyTheme(theme) {
      document.documentElement.dataset.theme = theme;

      if (toggle) {
        const isDark = theme === "dark";
        const label = toggle.querySelector("[data-theme-toggle-label]");
        if (label) label.textContent = isDark ? "Dark" : "Light";
        toggle.dataset.mode = theme;
        toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        toggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
        toggle.setAttribute("aria-pressed", String(isDark));
      }
    }

    applyTheme(preferredTheme());

    if (toggle) {
      toggle.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        window.localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
      });
    }

    mediaQuery.addEventListener("change", () => {
      if (!window.localStorage.getItem(storageKey)) {
        applyTheme(preferredTheme());
      }
    });
  }

  setupThemeToggle();
  populateCountries();
  setupForms();
  setupNavigation();
  setupWhatsAppLinks();
  setupLanguageSelectors();
  setupHospitalSliders();
  setupTestimonialVideos();
  setupZoomReveal();
})();
