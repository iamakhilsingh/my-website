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
  const canonicalSiteOrigin = "https://www.medtreatindia.com";
  const submissionCooldownMs = 20000;
  const minimumCompletionMs = 2500;

  function prefersLeanMobileExperience() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = Boolean(connection && connection.saveData);
    const slowConnection = Boolean(connection && /(^|-)2g$/.test(connection.effectiveType || ""));
    const lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 3;
    const narrowPhone = window.matchMedia("(max-width: 430px)").matches;
    const coarsePhone = window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;

    return coarsePhone && (narrowPhone || saveData || slowConnection || lowMemory);
  }

  function whatsappUrl(message) {
    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message || defaultMessage);
  }

  function populateCountries() {
    document.querySelectorAll("[data-country-select]").forEach((select) => {
      const selected = select.value;
      const existingValues = new Set(Array.from(select.options).map((option) => option.value));
      countryNames.forEach((country) => {
        if (existingValues.has(country)) return;
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        select.appendChild(option);
        existingValues.add(country);
      });
      select.value = selected;
      setupCountrySearch(select);
    });
  }

  function setupCountrySearch(select) {
    if (!select || select.dataset.countrySearchReady === "true") return;

    select.dataset.countrySearchReady = "true";
    const wrapper = document.createElement("div");
    const input = document.createElement("input");
    const listbox = document.createElement("div");
    const listboxId = "country-options-" + Math.random().toString(36).slice(2, 10);
    let matches = countryNames.slice();
    let activeIndex = -1;
    let isOpen = false;

    wrapper.className = "country-search";
    input.className = "country-search__input";
    input.type = "text";
    input.placeholder = "Type or select country";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.required = select.required;
    input.value = select.value;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-controls", listboxId);
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-label", "Country");

    listbox.className = "country-search__listbox";
    listbox.id = listboxId;
    listbox.hidden = true;
    listbox.setAttribute("role", "listbox");
    listbox.setAttribute("aria-label", "Country suggestions");

    select.required = false;
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");
    select.parentNode.insertBefore(wrapper, select);
    wrapper.append(select, input, listbox);

    function setOpen(nextOpen) {
      isOpen = nextOpen;
      listbox.hidden = !nextOpen;
      input.setAttribute("aria-expanded", String(nextOpen));
      wrapper.closest("label")?.classList.toggle("has-country-search-open", nextOpen);
      if (!nextOpen) {
        activeIndex = -1;
        input.removeAttribute("aria-activedescendant");
      }
    }

    function setActive(nextIndex) {
      const options = Array.from(listbox.querySelectorAll("[role='option']"));
      if (!options.length) return;
      activeIndex = (nextIndex + options.length) % options.length;
      options.forEach((option, index) => {
        const active = index === activeIndex;
        option.classList.toggle("is-active", active);
        option.setAttribute("aria-selected", String(active));
      });
      const activeOption = options[activeIndex];
      input.setAttribute("aria-activedescendant", activeOption.id);
      activeOption.scrollIntoView({ block: "nearest" });
    }

    function chooseCountry(country) {
      input.value = country;
      input.setCustomValidity("");
      select.value = country;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      setOpen(false);
    }

    function renderOptions(query = "") {
      const normalizedQuery = query.trim().toLocaleLowerCase();
      if (normalizedQuery) {
        const countriesBeginningWithQuery = [];
        const countriesContainingQuery = [];

        countryNames.forEach((country) => {
          const normalizedCountry = country.toLocaleLowerCase();
          if (normalizedCountry.startsWith(normalizedQuery)) {
            countriesBeginningWithQuery.push(country);
          } else if (normalizedCountry.includes(normalizedQuery)) {
            countriesContainingQuery.push(country);
          }
        });

        matches = countriesBeginningWithQuery.concat(countriesContainingQuery);
      } else {
        matches = countryNames.slice();
      }
      activeIndex = -1;
      listbox.innerHTML = "";

      if (!matches.length) {
        const empty = document.createElement("p");
        empty.className = "country-search__empty";
        empty.textContent = 'No countries found for "' + query.trim() + '"';
        listbox.appendChild(empty);
        return;
      }

      matches.forEach((country, index) => {
        const option = document.createElement("div");
        option.className = "country-search__option";
        option.id = listboxId + "-option-" + index;
        option.textContent = country;
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", "false");
        option.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          chooseCountry(country);
          input.focus();
        });
        listbox.appendChild(option);
      });
    }

    renderOptions();

    input.addEventListener("focus", () => {
      renderOptions();
      setOpen(true);
      if (input.value) {
        window.requestAnimationFrame(() => input.select());
      }
    });

    input.addEventListener("input", () => {
      const exactMatch = countryNames.find(
        (country) => country.toLocaleLowerCase() === input.value.trim().toLocaleLowerCase()
      );
      select.value = exactMatch || "";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      input.setCustomValidity(exactMatch || !input.value.trim() ? "" : "Please select a country from the list.");
      renderOptions(input.value);
      setOpen(true);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!isOpen) {
          renderOptions(input.value);
          setOpen(true);
        }
        setActive(activeIndex + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!isOpen) {
          renderOptions(input.value);
          setOpen(true);
        }
        setActive(activeIndex - 1);
      } else if (event.key === "Enter" && isOpen && activeIndex >= 0) {
        event.preventDefault();
        chooseCountry(matches[activeIndex]);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    });

    input.addEventListener("blur", () => {
      window.setTimeout(() => {
        const exactMatch = countryNames.find(
          (country) => country.toLocaleLowerCase() === input.value.trim().toLocaleLowerCase()
        );
        if (exactMatch) {
          chooseCountry(exactMatch);
        } else if (!input.value.trim()) {
          input.setCustomValidity("Please select a country.");
        }
        setOpen(false);
      }, 120);
    });

    select.addEventListener("change", () => {
      if (select.value && input.value !== select.value) {
        input.value = select.value;
        input.setCustomValidity("");
      }
    });

    wrapper.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("click", () => {
      setOpen(false);
    });
  }

  function callingCodeFor(country) {
    return countryCallingCodes[country] || "";
  }

  function formValue(data, keys) {
    for (const key of keys) {
      const value = data.get(key);
      if (value !== null && value !== undefined) {
        const text = String(value).trim();
        if (text) return text;
      }
    }
    return "";
  }

  function normalizeSourcePath(pathname) {
    const path = String(pathname || "/")
      .split(/[?#]/)[0]
      .trim();

    if (!path) return "/";

    const filename = path.split("/").filter(Boolean).pop() || "";
    const isFileSystemPath = /^\/(?:Users|System|private|Volumes)\//.test(path) || /^[A-Za-z]:[\\/]/.test(path);

    if (isFileSystemPath) {
      if (!filename) return "/";
      if (filename === "index.html") return "/";
      if (/^[A-Za-z0-9._-]+\.html$/.test(filename)) {
        return "/" + filename.replace(/\.html$/, "");
      }
      return "/";
    }

    if (/^\/[A-Za-z0-9/_-]*(?:\.html)?$/.test(path)) {
      if (path === "/index.html") return "/";
      return path.replace(/\.html$/, "") || "/";
    }

    if (!/^[A-Za-z0-9_-]+\.html$/.test(filename)) {
      return "/";
    }

    if (filename === "index.html") return "/";
    return "/" + filename.replace(/\.html$/, "");
  }

  function safeSourcePage() {
    try {
      const currentUrl = new URL(window.location.href);
      return canonicalSiteOrigin + normalizeSourcePath(currentUrl.pathname);
    } catch (error) {
      return canonicalSiteOrigin + normalizeSourcePath(window.location.pathname || "/");
    }
  }

  function captureSubmissionData(form) {
    const data = new FormData(form);
    const leadType = formValue(data, ["leadType"]);
    const country = formValue(data, ["country"]);
    const sourcePage = formValue(data, ["source", "sourcePage"]) || safeSourcePage();
    const phoneInput = formValue(data, [
      "phone",
      "phoneNumber",
      "mobile",
      "whatsapp",
      "whatsappNumber",
      "contactNumber",
      "phone_whatsapp"
    ]);
    const phoneCode = formValue(data, ["phoneCode"]) || callingCodeFor(country) || "";
    const phoneFull = phoneInput.startsWith("+") ? phoneInput : [phoneCode, phoneInput].filter(Boolean).join(" ");

    return {
      submittedAt: new Date().toISOString(),
      source: sourcePage,
      sourcePage,
      leadType,
      name: formValue(data, ["name"]),
      country,
      city: formValue(data, ["city"]),
      phoneCode,
      phone: phoneFull,
      localPhone: phoneInput,
      phoneFull,
      email: formValue(data, ["email"]),
      treatment: formValue(data, ["treatment"]),
      message: formValue(data, ["message"]),
      ageOrDob: formValue(data, ["ageOrDob", "age", "dob"]),
      budget: formValue(data, ["budget"]),
      date: formValue(data, ["date"]),
      consent: formValue(data, ["consent"]),
      website: formValue(data, ["website"]),
      startedAt: formValue(data, ["startedAt"])
    };
  }

  function formMessage(submission) {
    const lines = [
      "Hello MedTreat India, I submitted an enquiry on your website and would like to continue on WhatsApp.",
      "",
      "Name: " + submission.name
    ];

    if (submission.country) lines.push("Country: " + submission.country);
    if (submission.city) lines.push("City: " + submission.city);
    lines.push("Phone / WhatsApp: " + submission.phoneFull);
    if (submission.email) lines.push("Email: " + submission.email);
    if (submission.treatment && (submission.treatment !== "Other" || !submission.message)) {
      lines.push("Treatment need: " + submission.treatment);
    }

    if (submission.message) lines.push("Current medical problem: " + submission.message);
    if (submission.ageOrDob) lines.push("Age / DOB: " + submission.ageOrDob);
    if (submission.budget) lines.push("Budget: " + submission.budget);
    if (submission.date) lines.push("Preferred Date: " + submission.date);
    if (submission.sourcePage) lines.push("Source: " + submission.sourcePage);
    return lines.join("\n");
  }

  function formPayload(submission) {
    return {
      submittedAt: submission.submittedAt,
      source: submission.sourcePage,
      sourcePage: submission.sourcePage,
      leadType: submission.leadType,
      name: submission.name,
      country: submission.country,
      city: submission.city,
      phoneCode: submission.phoneCode,
      localPhone: submission.localPhone || submission.phone,
      phoneFull: submission.phoneFull,
      phone: submission.phone,
      email: submission.email,
      treatment: submission.treatment,
      message: submission.message,
      ageOrDob: submission.ageOrDob,
      budget: submission.budget,
      date: submission.date,
      consent: submission.consent,
      website: submission.website,
      startedAt: submission.startedAt
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
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      form.appendChild(status);
    }
    status.textContent = message;
    status.dataset.status = type || "info";
  }

  function submitToGoogleSheetInBackground(submission) {
    if (!googleSheetReady()) return false;

    const body = JSON.stringify(formPayload(submission));

    try {
      if ("sendBeacon" in navigator) {
        const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
        if (navigator.sendBeacon(googleSheetEndpoint, blob)) return true;
      }
    } catch (error) {
      // Fall back to fetch below; WhatsApp redirect must not be blocked.
    }

    try {
      fetch(googleSheetEndpoint, {
        method: "POST",
        mode: "no-cors",
        cache: "no-store",
        credentials: "omit",
        keepalive: true,
        referrerPolicy: "no-referrer",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body
      }).catch(() => {});
    } catch (error) {
      return false;
    }

    return true;
  }

  function openPreparedWhatsApp(url) {
    window.location.href = url;
  }

  function ensurePhoneCodeField(form) {
    const phoneInput = form.querySelector("input[name='phone']");
    if (!phoneInput) return;

    phoneInput.setAttribute("inputmode", "tel");
    phoneInput.setAttribute("pattern", "[0-9()+\\-\\s]{6,24}");
    phoneInput.setAttribute("maxlength", "24");
    phoneInput.setAttribute("placeholder", "Phone number");
    phoneInput.setAttribute("title", "Use a phone number with digits and optional spaces, hyphens or parentheses. Do not add letters.");

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

  function ensureSecurityFields(form) {
    let honeypot = form.querySelector("input[name='website']");
    if (!honeypot) {
      honeypot = document.createElement("input");
      honeypot.type = "text";
      honeypot.name = "website";
      honeypot.tabIndex = -1;
      honeypot.autocomplete = "off";
      honeypot.setAttribute("aria-hidden", "true");
      honeypot.className = "form-honeypot";
      form.appendChild(honeypot);
    }

    let startedAt = form.querySelector("input[name='startedAt']");
    if (!startedAt) {
      startedAt = document.createElement("input");
      startedAt.type = "hidden";
      startedAt.name = "startedAt";
      form.appendChild(startedAt);
    }

    startedAt.value = String(Date.now());
  }

  function ensureSourceField(form) {
    let source = form.querySelector("input[name='source']");
    if (!source) {
      source = document.createElement("input");
      source.type = "hidden";
      source.name = "source";
      form.appendChild(source);
    }

    source.value = safeSourcePage();
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
    } else if (!/^[0-9()+\-\s]+$/.test(value)) {
      input.setCustomValidity("Phone number can use digits, spaces, hyphens, parentheses and an optional + sign. Please remove letters or symbols.");
    } else if ((value.match(/[0-9]/g) || []).length < 6) {
      input.setCustomValidity("Please enter a valid phone number with at least 6 digits.");
    } else {
      input.setCustomValidity("");
    }

    input.toggleAttribute("aria-invalid", Boolean(input.validationMessage));
    return input.validationMessage === "";
  }

  function validateEmailInput(input) {
    const value = input.value.trim();
    input.value = value;

    if (!value && !input.required) {
      input.setCustomValidity("");
      input.toggleAttribute("aria-invalid", false);
      return true;
    }

    const hasWhitespace = /\s/.test(value);
    const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
    const isValid = Boolean(value) && value.length <= 254 && !hasWhitespace && emailPattern.test(value);
    input.setCustomValidity(isValid ? "" : "Please enter a valid email address, for example name@example.com.");
    input.toggleAttribute("aria-invalid", Boolean(input.validationMessage));
    return input.validationMessage === "";
  }

  function validateConsentInput(input) {
    if (!input) return true;
    if (input.type === "hidden") {
      input.setCustomValidity("");
      input.toggleAttribute("aria-invalid", false);
      return true;
    }
    input.setCustomValidity(input.checked ? "" : "Please confirm that you agree to the Privacy Policy before submitting.");
    input.toggleAttribute("aria-invalid", Boolean(input.validationMessage));
    return input.validationMessage === "";
  }

  function validateFormFields(form) {
    const phoneInput = form.querySelector("input[name='phone']");
    const emailInput = form.querySelector("input[name='email']");
    const consentInput = form.querySelector("input[name='consent']");
    if (phoneInput) validatePhoneInput(phoneInput);
    if (emailInput) validateEmailInput(emailInput);
    if (consentInput) validateConsentInput(consentInput);
  }

  function setupFormValidation(form) {
    ensurePhoneCodeField(form);
    ensureSecurityFields(form);
    ensureSourceField(form);
    updatePhoneCode(form);

    const countrySelect = form.querySelector("[data-country-select]");
    const phoneInput = form.querySelector("input[name='phone']");
    const emailInput = form.querySelector("input[name='email']");
    const nameInput = form.querySelector("input[name='name']");
    const messageInput = form.querySelector("textarea[name='message']");
    const consentInput = form.querySelector("input[name='consent']");

    if (nameInput) nameInput.setAttribute("maxlength", "120");
    if (emailInput) emailInput.setAttribute("maxlength", "254");
    if (messageInput) messageInput.setAttribute("maxlength", "1000");

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

    consentInput?.addEventListener("change", () => {
      validateConsentInput(consentInput);
    });

    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        updatePhoneCode(form);
        ensureSecurityFields(form);
        ensureSourceField(form);
      }, 0);
    });
  }

  function setupForms() {
    document.querySelectorAll("[data-consult-form]").forEach((form) => {
      setupFormValidation(form);

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (form.dataset.submitting === "true") return;

        const lastSubmittedAt = Number(form.dataset.lastSubmittedAt || "0");
        if (lastSubmittedAt && Date.now() - lastSubmittedAt < submissionCooldownMs) {
          setFormStatus(form, "Please wait a few seconds before submitting again.", "error");
          return;
        }

        validateFormFields(form);
        if (!form.checkValidity()) {
          form.reportValidity();
          setFormStatus(form, "Please correct the highlighted details before submitting.", "error");
          return;
        }

        const honeypot = form.querySelector("input[name='website']");
        if (honeypot && honeypot.value.trim()) {
          form.reset();
          setFormStatus(form, "Thank you. Your enquiry was submitted for review.", "success");
          return;
        }

        const startedAt = Number(form.querySelector("input[name='startedAt']")?.value || "0");
        if (!startedAt || Date.now() - startedAt < minimumCompletionMs) {
          setFormStatus(form, "Please take a moment to review your details, then submit again.", "error");
          return;
        }

        const submission = captureSubmissionData(form);
        const message = formMessage(submission);
        const targetUrl = whatsappUrl(message);
        const button = form.querySelector("button[type='submit']");
        if (button) button.disabled = true;
        form.dataset.submitting = "true";
        form.dataset.lastSubmittedAt = String(Date.now());
        submitToGoogleSheetInBackground(submission);
        setFormStatus(form, "Opening WhatsApp with your enquiry details...", "success");

        openPreparedWhatsApp(targetUrl);
      });
    });
  }

  function setupNavigation() {
    const button = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (!button || !nav) return;

    function setOpen(isOpen) {
      nav.classList.toggle("is-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      document.body.classList.toggle("nav-open", isOpen);
    }

    button.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        setOpen(false);
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (event.target.closest("[data-nav]") || event.target.closest("[data-nav-toggle]")) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function setupImageLoading() {
    document.querySelectorAll("img").forEach((image) => {
      image.decoding = "async";
      if (image.closest(".brand") || image.closest(".hero-bg")) return;
      if (!image.hasAttribute("loading")) image.loading = "lazy";
    });

    const heroImage = document.querySelector(".hero-bg img");
    if (heroImage) {
      heroImage.decoding = "async";
      heroImage.setAttribute("fetchpriority", "high");
    }
  }

  function setupWhatsAppLinks() {
    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      link.setAttribute("href", whatsappUrl(defaultMessage));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function setupFooterSocialLinks() {
    const socialMarkup = [
      '<nav class="footer-social-links" aria-label="MedTreat India social media profiles">',
      '  <a class="footer-social-link hero-social-instagram" href="https://www.instagram.com/medtreatindiaofficial/" data-social-app-url="instagram://user?username=medtreatindiaofficial" data-social-web-url="https://www.instagram.com/medtreatindiaofficial/" target="_blank" rel="noopener noreferrer" aria-label="Open MedTreat India on Instagram">',
      '    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"></path></svg>',
      '  </a>',
      '  <a class="footer-social-link hero-social-facebook" href="https://www.facebook.com/profile.php?id=61589123865030" data-social-app-url="fb://profile/61589123865030" data-social-web-url="https://www.facebook.com/profile.php?id=61589123865030" target="_blank" rel="noopener noreferrer" aria-label="Open MedTreat India on Facebook">',
      '    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"></path></svg>',
      '  </a>',
      '  <a class="footer-social-link hero-social-linkedin" href="https://www.linkedin.com/in/medtreat-india-2607b3411/" data-social-app-url="linkedin://in/medtreat-india-2607b3411" data-social-web-url="https://www.linkedin.com/in/medtreat-india-2607b3411/" target="_blank" rel="noopener noreferrer" aria-label="Open MedTreat India on LinkedIn">',
      '    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>',
      '  </a>',
      '  <a class="footer-social-link hero-social-youtube" href="https://www.youtube.com/@MedTreatIndia" data-social-app-url="vnd.youtube://www.youtube.com/@MedTreatIndia" data-social-web-url="https://www.youtube.com/@MedTreatIndia" target="_blank" rel="noopener noreferrer" aria-label="Open MedTreat India on YouTube">',
      '    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>',
      '  </a>',
      '</nav>'
    ].join("");

    document.querySelectorAll(".site-footer .footer-grid > div:first-child").forEach((brandColumn) => {
      if (brandColumn.querySelector(".footer-social-links")) return;
      const template = document.createElement("template");
      template.innerHTML = socialMarkup.trim();
      brandColumn.appendChild(template.content.firstElementChild);
    });
  }

  function setupSocialAppLinks() {
    const mobileMatcher = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 768px)");

    document.querySelectorAll("[data-social-app-url][data-social-web-url]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (!mobileMatcher.matches) return;

        const appUrl = link.getAttribute("data-social-app-url");
        const webUrl = link.getAttribute("data-social-web-url") || link.href;
        if (!appUrl || !webUrl) return;

        event.preventDefault();

        let fallbackTimer = window.setTimeout(() => {
          window.location.href = webUrl;
        }, 900);

        const cancelFallback = () => {
          window.clearTimeout(fallbackTimer);
          fallbackTimer = null;
        };

        window.addEventListener("pagehide", cancelFallback, { once: true });
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) cancelFallback();
        }, { once: true });

        window.location.href = appUrl;
      });
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
      const label = document.createElement("span");
      label.textContent = "Language";
      wrapper.appendChild(label);

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
        if (prefersLeanMobileExperience()) return;
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
        iframe.src = "https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
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
    if (prefersLeanMobileExperience()) {
      document.body.classList.add("lean-mobile-experience");
      return;
    }

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
      return !element.closest("[data-zoom-reveal]") &&
        !element.matches(".site-header, .site-header *, .blog-article-body");
    });

    document.body.classList.add("zoom-reveal-ready");

    elements.forEach((element, index) => {
      element.setAttribute("data-zoom-reveal", "");
      element.classList.add("zoom-delay-" + Math.min(index % 6, 5));
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

  function setupFloatingWhatsAppVisibility() {
    const floatingButton = document.querySelector(".floating-wa");
    const hero = document.querySelector(".hero");
    const mobileQuery = window.matchMedia("(max-width: 700px)");

    if (!floatingButton || !hero || !("IntersectionObserver" in window)) return;

    function setHidden(isHeroVisible) {
      floatingButton.classList.toggle("is-hidden-on-hero", mobileQuery.matches && isHeroVisible);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const heroEntry = entries.find((entry) => entry.target === hero);
        if (heroEntry) setHidden(heroEntry.isIntersecting);
      },
      { threshold: 0.08 }
    );

    observer.observe(hero);

    const handleMobileChange = () => {
      setHidden(hero.getBoundingClientRect().bottom > 0);
    };

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleMobileChange);
    } else if (typeof mobileQuery.addListener === "function") {
      mobileQuery.addListener(handleMobileChange);
    }
  }

  setupThemeToggle();
  populateCountries();
  setupForms();
  setupNavigation();
  setupWhatsAppLinks();
  setupFooterSocialLinks();
  setupSocialAppLinks();
  setupFloatingWhatsAppVisibility();
  setupLanguageSelectors();
  setupImageLoading();
  setupHospitalSliders();
  setupTestimonialVideos();
  setupZoomReveal();
})();
