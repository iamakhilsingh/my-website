(function () {
  "use strict";

  let leadPopupElement = null;
  let leadPopupTimer = null;

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
  const submissionCooldownMs = 20000;
  const minimumCompletionMs = 2500;

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
      return normalizeSourcePath(currentUrl.pathname);
    } catch (error) {
      return normalizeSourcePath(window.location.pathname || "/");
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

  function closeLeadPopup(persist = false) {
    if (!leadPopupElement) return;
    leadPopupElement.classList.remove("is-open");
    leadPopupElement.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lead-popup-open");
    window.setTimeout(() => {
      if (leadPopupElement) leadPopupElement.hidden = true;
    }, 240);
  }

  function openLeadPopup() {
    if (!leadPopupElement || leadPopupElement.hidden === false) return;
    leadPopupElement.hidden = false;
    leadPopupElement.setAttribute("aria-hidden", "false");
    document.body.classList.add("lead-popup-open");
    window.requestAnimationFrame(() => {
      leadPopupElement?.classList.add("is-open");
    });

    const focusTarget = leadPopupElement.querySelector("input:not([type='hidden']), select, textarea, button");
    if (focusTarget) {
      window.setTimeout(() => focusTarget.focus({ preventScroll: true }), 40);
    }
  }

  function setupLeadPopup() {
    if (normalizeSourcePath(window.location.pathname || "/") !== "/") return;

    const popup = document.createElement("section");
    popup.className = "lead-popup";
    popup.hidden = true;
    popup.setAttribute("aria-hidden", "true");
    popup.innerHTML = [
      '<div class="lead-popup__backdrop" data-lead-popup-close></div>',
      '<div class="lead-popup__panel quote-form-card" role="dialog" aria-modal="true" aria-labelledby="lead-popup-title">',
      '  <button class="lead-popup__close" type="button" aria-label="Close popup" data-lead-popup-close>&times;</button>',
      '  <h2 id="lead-popup-title">Let Us Help You</h2>',
      '  <form class="consult-form lead-popup__form" data-consult-form data-form-variant="popup">',
      '    <input name="leadType" type="hidden" value="popup" />',
      '    <input name="treatment" type="hidden" value="Other" />',
      '    <input name="consent" type="hidden" value="true" />',
      '    <label class="field-label-hidden"><span>Patient Name</span><input name="name" autocomplete="name" maxlength="120" placeholder="Patient Name" required /></label>',
      '    <label class="field-label-hidden"><span>Country</span><select name="country" data-country-select required><option value="India" selected>India</option></select></label>',
      '    <label class="field-label-hidden"><span>City</span><input name="city" autocomplete="address-level2" maxlength="80" placeholder="City" required /></label>',
      '    <label class="field-label-hidden phone-field"><span>Your Phone number</span><input name="phone" autocomplete="tel-national" placeholder="Your Phone number" required /></label>',
      '    <label class="field-label-hidden"><span>Email Address</span><input name="email" type="email" autocomplete="email" maxlength="254" placeholder="Email Address" /></label>',
      '    <label class="field-label-hidden"><span>Date of Birth</span><input name="ageOrDob" autocomplete="bday" maxlength="40" placeholder="Date of Birth (DD-MM-YYYY)" /></label>',
      '    <label class="field-label-hidden"><span>Describe The Current Medical Problem</span><textarea name="message" rows="3" maxlength="1000" placeholder="Describe The Current Medical Problem"></textarea></label>',
      '    <input class="form-honeypot" name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" />',
      '    <input name="startedAt" type="hidden" value="" />',
      '    <button class="btn btn-primary btn-full" type="submit">Get FREE Quote</button>',
      '    <p class="form-legal">By submitting this form I agree to the <a class="text-link" href="terms-and-conditions.html">Terms of Use</a> and <a class="text-link" href="privacy-policy.html">Privacy Policy</a> of MedTreat India.</p>',
      "  </form>",
      "</div>"
    ].join("");

    popup.addEventListener("click", (event) => {
      if (event.target.matches("[data-lead-popup-close]")) {
        closeLeadPopup(true);
      }
    });

    document.body.appendChild(popup);
    leadPopupElement = popup;

    populateCountries();
    setupFormValidation(popup.querySelector("[data-consult-form]"));

    leadPopupTimer = window.setTimeout(() => {
      openLeadPopup();
    }, 3000);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && leadPopupElement && leadPopupElement.classList.contains("is-open")) {
        closeLeadPopup(true);
      }
    });
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

        if (form.closest("[data-form-variant='popup']")) {
          closeLeadPopup(true);
        }
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
  setupLeadPopup();
  setupForms();
  setupNavigation();
  setupWhatsAppLinks();
  setupFloatingWhatsAppVisibility();
  setupLanguageSelectors();
  setupImageLoading();
  setupHospitalSliders();
  setupTestimonialVideos();
  setupZoomReveal();
})();
