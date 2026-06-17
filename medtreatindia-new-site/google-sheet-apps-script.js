const SHEET_NAME = "Responses";
const MIN_FORM_AGE_MS = 2500;
const DUPLICATE_WINDOW_SECONDS = 90;
const ALLOWED_TREATMENTS = {
  "Cardiology / Heart Surgery": true,
  Orthopedics: true,
  Oncology: true,
  "IVF & Fertility": true,
  "Transplant Review": true,
  Other: true
};
const RESPONSE_HEADERS = [
  "Submitted At",
  "Name",
  "Country",
  "Phone Code",
  "Local Phone",
  "Full Phone / WhatsApp",
  "Email",
  "Treatment",
  "Message",
  "Consent",
  "Budget",
  "Preferred Date",
  "Source Page"
];

function doPost(e) {
  try {
    const data = validatePayload(parsePayload(e));
    if (isSpamSubmission(data)) return jsonResponse({ ok: true });
    if (isDuplicateSubmission(data)) return jsonResponse({ ok: true });

    const sheet = getResponseSheet();
    ensureHeaders(sheet);

    const row = [
      data.submittedAt,
      data.name,
      data.country,
      data.phoneCode,
      data.localPhone,
      data.phoneFull,
      data.email,
      data.treatment,
      data.message,
      data.consent ? "Yes" : "No",
      data.budget,
      data.date,
      data.sourcePage
    ];

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      const nextRow = sheet.getLastRow() + 1;
      sheet.getRange(nextRow, 1, 1, row.length).setNumberFormat("@");
      sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false });
  }
}

function parsePayload(e) {
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function validatePayload(data) {
  const submittedAt = sanitizeText(data.submittedAt, 64);
  const startedAtRaw = sanitizeText(data.startedAt, 64);
  const startedAt = Number(startedAtRaw);
  const name = sanitizeText(data.name, 120);
  const country = sanitizeText(data.country, 80);
  const phoneCode = sanitizeText(data.phoneCode, 8);
  const localPhone = sanitizeText(data.localPhone, 15);
  const phoneFull = sanitizeText([phoneCode, localPhone].filter(Boolean).join(" "), 24);
  const email = sanitizeText(data.email, 254).toLowerCase();
  const treatment = sanitizeText(data.treatment, 80);
  const message = sanitizeText(data.message, 1000);
  const budget = sanitizeText(data.budget, 80);
  const date = sanitizeText(data.date, 80);
  const sourcePage = sanitizePath(data.sourcePage);
  const consent = String(data.consent || "").toLowerCase() === "true" || String(data.consent || "").toLowerCase() === "on";
  const website = sanitizeText(data.website, 120);

  if (!submittedAt) throw new Error("Missing submission timestamp");
  if (!startedAt || !isFinite(startedAt) || Date.now() - startedAt < MIN_FORM_AGE_MS) throw new Error("Form completed too quickly");
  if (!consent) throw new Error("Consent not given");
  if (!name || name.length < 2) throw new Error("Invalid name");
  if (!country) throw new Error("Invalid country");
  if (!/^\+[0-9]{1,4}$/.test(phoneCode)) throw new Error("Invalid phone code");
  if (!/^[0-9]{6,15}$/.test(localPhone)) throw new Error("Invalid local phone");
  if (!isValidEmail(email)) throw new Error("Invalid email");
  if (!ALLOWED_TREATMENTS[treatment]) throw new Error("Invalid treatment");
  if (message && message.length > 1000) throw new Error("Message too long");

  return {
    submittedAt: asSheetText(submittedAt),
    startedAt: startedAt,
    name: asSheetText(name),
    country: asSheetText(country),
    phoneCode: asSheetText(phoneCode),
    localPhone: asSheetText(localPhone),
    phoneFull: asSheetText(phoneFull),
    email: asSheetText(email),
    treatment: asSheetText(treatment),
    message: asSheetText(message),
    consent: consent,
    budget: asSheetText(budget),
    date: asSheetText(date),
    sourcePage: asSheetText(sourcePage),
    website: website
  };
}

function isSpamSubmission(data) {
  return Boolean(data.website);
}

function isDuplicateSubmission(data) {
  const fingerprintSource = [
    data.email,
    data.phoneFull,
    data.treatment,
    data.sourcePage
  ].join("|");
  const key = "lead:" + Utilities.base64EncodeWebSafe(fingerprintSource).slice(0, 120);
  const cache = CacheService.getScriptCache();
  if (cache.get(key)) return true;
  cache.put(key, "1", DUPLICATE_WINDOW_SECONDS);
  return false;
}

function getResponseSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(RESPONSE_HEADERS);
    return;
  }

  const currentWidth = Math.max(sheet.getLastColumn(), RESPONSE_HEADERS.length);
  const currentHeaders = sheet.getRange(1, 1, 1, currentWidth).getValues()[0];
  let needsUpdate = currentWidth < RESPONSE_HEADERS.length;

  RESPONSE_HEADERS.forEach(function (header, index) {
    if (currentHeaders[index] !== header) {
      currentHeaders[index] = header;
      needsUpdate = true;
    }
  });

  if (needsUpdate) {
    sheet.getRange(1, 1, 1, RESPONSE_HEADERS.length).setValues([RESPONSE_HEADERS]);
  }
}

function sanitizeText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength || 1000);
}

function sanitizePath(value) {
  const path = sanitizeText(value, 120);
  return /^\/[A-Za-z0-9/_-]*$/.test(path) ? path : "/";
}

function normalizeLegacySourcePath(value) {
  const raw = String(value || "").trim();
  if (!raw) return "/";

  if (/^\/[A-Za-z0-9/_-]*$/.test(raw)) {
    return raw || "/";
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      return sanitizePath(String(parsed.pathname || "/").replace(/\.html$/, "") || "/");
    } catch (error) {
      return "/";
    }
  }

  if (/^file:\/\//i.test(raw)) {
    const cleaned = raw.split(/[?#]/)[0];
    const filename = cleaned.split("/").filter(Boolean).pop() || "";
    if (filename === "index.html") return "/";
    if (/^[A-Za-z0-9_-]+\.html$/.test(filename)) {
      return "/" + filename.replace(/\.html$/, "");
    }
  }

  return "/";
}

function asSheetText(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function isValidEmail(value) {
  return /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/.test(value);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function repairLegacyPhoneErrors() {
  const sheet = getResponseSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const phoneRange = sheet.getRange(2, 4, lastRow - 1, 3);
  const values = phoneRange.getDisplayValues().map(function (row) {
    return row.map(function (cell) {
      const cleaned = String(cell || "").replace(/^=/, "").trim();
      return asSheetText(cleaned);
    });
  });

  phoneRange.setNumberFormat("@");
  phoneRange.setValues(values);
}

function repairLegacySourcePages() {
  const sheet = getResponseSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const sourceColumn = RESPONSE_HEADERS.indexOf("Source Page") + 1;
  if (!sourceColumn) return;

  const range = sheet.getRange(2, sourceColumn, lastRow - 1, 1);
  const values = range.getDisplayValues().map(function (row) {
    return [asSheetText(normalizeLegacySourcePath(row[0]))];
  });

  range.setNumberFormat("@");
  range.setValues(values);
}
