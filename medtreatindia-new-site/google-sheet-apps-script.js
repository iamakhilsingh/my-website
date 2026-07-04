const SHEET_NAME = "Responses";
const CANONICAL_SITE_ORIGIN = "https://www.medtreatindia.com";
const CONFIRMATION_SENDER_EMAIL = "support@medtreatindia.com";
const CONFIRMATION_SENDER_NAME = "MedTreat India";
const CONFIRMATION_SUBJECT = "We received your MedTreat India enquiry";
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
  "Phone / WhatsApp",
  "Email",
  "Treatment",
  "Message",
  "Budget",
  "Preferred Date",
  "Source Page",
  "City",
  "Age / DOB",
  "Phone Code",
  "Local Phone",
  "Email Status"
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("MedTreat Tools")
    .addItem("Repair existing responses", "repairExistingResponses")
    .addToUi();
}

function doPost(e) {
  try {
    const data = validatePayload(parsePayload(e));
    if (isSpamSubmission(data)) return jsonResponse({ ok: true });
    if (isDuplicateSubmission(data)) return jsonResponse({ ok: true });

    const sheet = getResponseSheet();
    ensureHeaders(sheet);
    const headers = getHeaders(sheet);
    const rowMap = buildRowMap(data);
    const row = headers.map(function (header) {
      return rowMap[header] || "";
    });

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      const nextRow = sheet.getLastRow() + 1;
      sheet.getRange(nextRow, 1, 1, row.length).setNumberFormat("@");
      sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    } finally {
      lock.releaseLock();
    }

    try {
      sendFormConfirmationEmail(data);
    } catch (emailError) {
      console.error("Confirmation email failed: " + (emailError && emailError.stack ? emailError.stack : emailError));
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return jsonResponse({ ok: false });
  }
}

function parsePayload(e) {
  const body = e && e.postData ? String(e.postData.contents || "") : "";
  const contentType = e && e.postData ? String(e.postData.type || "").toLowerCase() : "";
  const params = e && e.parameter ? e.parameter : {};

  let parsed = {};

  if (body) {
    if (contentType.indexOf("application/json") !== -1 || body.trim().charAt(0) === "{") {
      try {
        parsed = JSON.parse(body);
      } catch (error) {
        parsed = {};
      }
    } else if (contentType.indexOf("application/x-www-form-urlencoded") !== -1 || body.indexOf("=") !== -1) {
      parsed = Object.fromEntries(body.split("&").map(function (pair) {
        const parts = pair.split("=");
        const key = decodeURIComponent(parts[0] || "");
        const value = decodeURIComponent((parts[1] || "").replace(/\+/g, " "));
        return [key, value];
      }));
    }
  }

  return Object.assign({}, params, parsed);
}

function buildRowMap(data) {
  return {
    "Submitted At": data.submittedAt,
    "Name": data.name,
    "Country": data.country,
    "Phone / WhatsApp": data.phoneFull || data.phone,
    "Email": data.email,
    "Treatment": data.treatment,
    "Message": data.message,
    "Budget": data.budget,
    "Preferred Date": data.date,
    "Source Page": data.sourcePage,
    "City": data.city,
    "Age / DOB": data.ageOrDob,
    "Phone Code": data.phoneCode,
    "Local Phone": data.localPhone,
    "Email Status": data.emailStatus
  };
}

function sendFormConfirmationEmail(data) {
  const patientName = plainTextValue(data.name) || "there";
  const treatment = plainTextValue(data.treatment);
  const treatmentSentence = treatment
    ? "We have received your enquiry about " + treatment + "."
    : "We have received your enquiry.";
  const plainBody = [
    "Hello " + patientName + ",",
    "",
    "Thank you for contacting MedTreat India.",
    treatmentSentence,
    "",
    "Our patient support team will review your enquiry and contact you soon.",
    "You can reply directly to this email if you would like to add any information.",
    "",
    "Regards,",
    "MedTreat India Patient Support",
    "support@medtreatindia.com",
    "https://www.medtreatindia.com"
  ].join("\n");
  const htmlBody = [
    '<div style="background:#f4f7f6;padding:24px 12px;font-family:Arial,sans-serif;color:#17352d;">',
    '  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #dfe9e5;border-radius:12px;overflow:hidden;">',
    '    <div style="background:#0b6b57;padding:22px 28px;color:#ffffff;">',
    '      <div style="font-size:22px;font-weight:700;">MedTreat India</div>',
    '      <div style="font-size:14px;margin-top:4px;">Patient-first medical travel guidance</div>',
    "    </div>",
    '    <div style="padding:28px;font-size:16px;line-height:1.6;">',
    "      <p>Hello " + escapeHtml(patientName) + ",</p>",
    "      <p>Thank you for contacting MedTreat India.</p>",
    "      <p>" + escapeHtml(treatmentSentence) + "</p>",
    "      <p>Our patient support team will review your enquiry and contact you soon.</p>",
    "      <p>You can reply directly to this email if you would like to add any information.</p>",
    "      <p style=\"margin-top:26px;\">Regards,<br><strong>MedTreat India Patient Support</strong><br>",
    '      <a href="mailto:support@medtreatindia.com" style="color:#0b6b57;">support@medtreatindia.com</a></p>',
    "    </div>",
    "  </div>",
    "</div>"
  ].join("");
  const options = {
    htmlBody: htmlBody,
    name: CONFIRMATION_SENDER_NAME,
    replyTo: CONFIRMATION_SENDER_EMAIL
  };
  const effectiveSender = String(Session.getEffectiveUser().getEmail() || "").toLowerCase();
  const senderAliases = GmailApp.getAliases().map(function (alias) {
    return String(alias || "").toLowerCase();
  });

  if (effectiveSender !== CONFIRMATION_SENDER_EMAIL) {
    if (senderAliases.indexOf(CONFIRMATION_SENDER_EMAIL) === -1) {
      throw new Error(
        "Deploy this web app as " + CONFIRMATION_SENDER_EMAIL +
        " or configure that address as a Gmail sending alias."
      );
    }
    options.from = CONFIRMATION_SENDER_EMAIL;
  }

  GmailApp.sendEmail(
    plainTextValue(data.email),
    CONFIRMATION_SUBJECT,
    plainBody,
    options
  );
}

function plainTextValue(value) {
  return String(value || "").replace(/^'/, "").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validatePayload(data) {
  const submittedAt = sanitizeText(pickField(data, ["submittedAt"]), 64);
  const startedAtRaw = sanitizeText(pickField(data, ["startedAt"]), 64);
  const startedAt = Number(startedAtRaw);
  const leadType = sanitizeText(pickField(data, ["leadType"]), 40);
  const isQuickLead = leadType === "popup" || leadType === "home-quote";
  const name = sanitizeText(pickField(data, ["name"]), 120);
  const country = sanitizeText(pickField(data, ["country"]), 80);
  const city = sanitizeText(pickField(data, ["city"]), 80);
  const phoneCode = sanitizeText(pickField(data, ["phoneCode"]), 8);
  const phoneValue = pickField(data, [
    "phone",
    "phoneNumber",
    "mobile",
    "whatsapp",
    "whatsappNumber",
    "contactNumber",
    "phone_whatsapp"
  ]);
  const suppliedPhoneFull = pickField(data, ["phoneFull", "fullPhone"]);
  const localPhone = sanitizeText(pickField(data, ["localPhone"]) || phoneValue, 30);
  const phoneFull = sanitizeText(
    suppliedPhoneFull || (phoneValue.startsWith("+") ? phoneValue : [phoneCode, localPhone].filter(Boolean).join(" ")),
    40
  );
  const email = sanitizeText(pickField(data, ["email"]), 254).toLowerCase();
  const treatment = sanitizeText(pickField(data, ["treatment"]), 80);
  const message = sanitizeText(pickField(data, ["message"]), 1000);
  const ageOrDob = sanitizeText(pickField(data, ["ageOrDob", "age", "dob"]), 40);
  const budget = sanitizeText(pickField(data, ["budget"]), 80);
  const date = sanitizeText(pickField(data, ["date"]), 80);
  const sourcePage = sanitizePath(pickField(data, ["sourcePage", "source"]));
  const website = sanitizeText(pickField(data, ["website"]), 120);
  const consentValue = String(pickField(data, ["consent"]) || "").toLowerCase();
  const consent = consentValue === "true" || consentValue === "on";

  if (!submittedAt) throw new Error("Missing submission timestamp");
  if (!startedAt || !isFinite(startedAt) || Date.now() - startedAt < MIN_FORM_AGE_MS) throw new Error("Form completed too quickly");
  if (!consent) throw new Error("Consent not given");
  if (!name || name.length < 2) throw new Error("Invalid name");
  if (!phoneFull || !/[0-9]/.test(phoneFull)) throw new Error("Invalid phone");
  if (phoneValue && !/^[0-9\s()+\-]+$/.test(phoneValue)) throw new Error("Invalid phone");
  if (phoneCode && !/^\+[0-9]{1,4}$/.test(phoneCode)) throw new Error("Invalid phone code");
  if (localPhone && !/^[0-9+\s()+\-]{4,30}$/.test(localPhone)) throw new Error("Invalid local phone");
  if (!country && !isQuickLead) throw new Error("Invalid country");
  if (!email) throw new Error("Invalid email");
  if (email && !isValidEmail(email)) throw new Error("Invalid email");
  if (!ALLOWED_TREATMENTS[treatment]) throw new Error("Invalid treatment");
  if (message && message.length > 1000) throw new Error("Message too long");

  return {
    submittedAt: asSheetText(submittedAt),
    startedAt: startedAt,
    leadType: asSheetText(leadType),
    name: asSheetText(name),
    country: asSheetText(country),
    city: asSheetText(city),
    phoneCode: asSheetText(phoneCode),
    localPhone: asSheetText(localPhone),
    phoneFull: asSheetText(phoneFull),
    email: asSheetText(email),
    emailStatus: "Valid",
    treatment: asSheetText(treatment),
    message: asSheetText(message),
    ageOrDob: asSheetText(ageOrDob),
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

  const currentWidth = Math.max(sheet.getLastColumn(), 1);
  const currentHeaders = sheet.getRange(1, 1, 1, currentWidth).getDisplayValues()[0]
    .map(function (header) { return String(header || "").trim(); });
  const missingHeaders = RESPONSE_HEADERS.filter(function (header) {
    return currentHeaders.indexOf(header) === -1;
  });

  if (missingHeaders.length) {
    sheet.getRange(1, currentHeaders.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
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
  return canonicalSourceUrl(value);
}

function pickField(data, keys) {
  for (var i = 0; i < keys.length; i += 1) {
    var key = keys[i];
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      var value = data[key];
      if (value !== null && value !== undefined && String(value).trim() !== "") {
        return String(value).trim();
      }
    }
  }
  return "";
}

function normalizeLegacySourcePath(value) {
  return canonicalSourceUrl(value);
}

function normalizePathValue(value) {
  const raw = String(value || "").trim();
  if (!raw) return "/";

  const stripped = raw.split(/[?#]/)[0].trim();
  const filename = stripped.split("/").filter(Boolean).pop() || "";
  const isFileSystemPath = /^\/(?:Users|System|private|Volumes)\//.test(stripped) || /^[A-Za-z]:[\\/]/.test(stripped);

  if (isFileSystemPath) {
    if (!filename || filename === "index.html") return "/";
    if (/^[A-Za-z0-9._-]+\.html$/.test(filename)) {
      return "/" + filename.replace(/\.html$/, "");
    }
    return "/";
  }

  if (/^file:\/\//i.test(stripped)) {
    try {
      const parsed = new URL(stripped);
      return normalizePathValue(parsed.pathname || "/");
    } catch (error) {
      return "/";
    }
  }

  if (/^https?:\/\//i.test(stripped)) {
    try {
      const parsed = new URL(stripped);
      return normalizePathValue(parsed.pathname || "/");
    } catch (error) {
      return "/";
    }
  }

  if (/^\/[A-Za-z0-9/_-]*(?:\.html)?$/.test(stripped)) {
    if (stripped === "/index.html") return "/";
    return stripped.replace(/\.html$/, "") || "/";
  }

  if (filename === "index.html") return "/";
  if (/^[A-Za-z0-9._-]+\.html$/.test(filename)) {
    return "/" + filename.replace(/\.html$/, "");
  }

  return "/";
}

function canonicalSourceUrl(value) {
  return CANONICAL_SITE_ORIGIN + normalizePathValue(value);
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

  const headers = getHeaders(sheet);
  const phoneColumn = headers.indexOf("Phone / WhatsApp") + 1;
  if (!phoneColumn) return;
  const phoneRange = sheet.getRange(2, phoneColumn, lastRow - 1, 1);
  const formulas = phoneRange.getFormulas();
  const values = phoneRange.getDisplayValues().map(function (row, index) {
    const display = String(row[0] || "").trim();
    const formula = String(formulas[index][0] || "").trim();
    const recovered = recoverPhoneText(display, formula);
    return [asSheetText(recovered)];
  });

  phoneRange.setNumberFormat("@");
  phoneRange.setValues(values);
}

function repairLegacySourcePages() {
  const sheet = getResponseSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const sourceColumn = getHeaders(sheet).indexOf("Source Page") + 1;
  if (!sourceColumn) return;

  const range = sheet.getRange(2, sourceColumn, lastRow - 1, 1);
  const values = range.getDisplayValues().map(function (row) {
    return [asSheetText(normalizeLegacySourcePath(row[0]))];
  });

  range.setNumberFormat("@");
  range.setValues(values);
}

function repairExistingResponses() {
  const sheet = getResponseSheet();
  ensureHeaders(sheet);
  let tableColumnsUpdated = false;
  let tableColumnWarning = "";
  try {
    tableColumnsUpdated = forceResponseTableTextColumns();
  } catch (error) {
    tableColumnWarning = String(error && error.message ? error.message : error);
    console.warn(tableColumnWarning);
  }
  repairLegacyPhoneErrors();
  repairLegacySourcePages();
  repairLegacyEmails();
  populateDerivedColumns();

  const message = tableColumnWarning
    ? "Rows repaired. Google Table column-type update needs review."
    : "Responses repaired. Phone, email and source columns are now clean text.";
  SpreadsheetApp.getActiveSpreadsheet().toast(message, "MedTreat repair", 8);
  return {
    ok: !tableColumnWarning,
    tableColumnsUpdated: tableColumnsUpdated,
    warning: tableColumnWarning
  };
}

function repairLegacyEmails() {
  const sheet = getResponseSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const headers = getHeaders(sheet);
  const emailColumn = headers.indexOf("Email") + 1;
  const statusColumn = headers.indexOf("Email Status") + 1;
  if (!emailColumn || !statusColumn) return;

  const emailRange = sheet.getRange(2, emailColumn, lastRow - 1, 1);
  const displayValues = emailRange.getDisplayValues();
  const rawValues = emailRange.getValues();
  const normalized = [];
  const statuses = [];

  displayValues.forEach(function (row, index) {
    const candidates = [rawValues[index][0], row[0]];
    let email = "";
    candidates.some(function (candidate) {
      const match = String(candidate || "").toLowerCase().match(/[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}/);
      if (!match) return false;
      email = match[0];
      return true;
    });

    normalized.push([email || sanitizeText(row[0], 254)]);
    statuses.push([email ? "Valid" : (String(row[0] || "").trim() ? "Needs review" : "Missing")]);
  });

  emailRange.clearDataValidations().setNumberFormat("@").setValues(normalized);
  sheet.getRange(2, statusColumn, lastRow - 1, 1).setNumberFormat("@").setValues(statuses);
}

function populateDerivedColumns() {
  const sheet = getResponseSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const headers = getHeaders(sheet);
  const phoneColumn = headers.indexOf("Phone / WhatsApp") + 1;
  const codeColumn = headers.indexOf("Phone Code") + 1;
  const localColumn = headers.indexOf("Local Phone") + 1;
  if (!phoneColumn || !codeColumn || !localColumn) return;

  const phoneValues = sheet.getRange(2, phoneColumn, lastRow - 1, 1).getDisplayValues();
  const codes = [];
  const localNumbers = [];
  phoneValues.forEach(function (row) {
    const parsed = splitPhoneNumber(row[0]);
    codes.push([parsed.code]);
    localNumbers.push([parsed.local]);
  });

  sheet.getRange(2, codeColumn, lastRow - 1, 1).setNumberFormat("@").setValues(codes);
  sheet.getRange(2, localColumn, lastRow - 1, 1).setNumberFormat("@").setValues(localNumbers);
}

function splitPhoneNumber(value) {
  const text = String(value || "").replace(/^'/, "").trim();
  const match = text.match(/^(\+[0-9]{1,4})[\s-]*(.*)$/);
  return {
    code: match ? match[1] : "",
    local: match ? match[2] : text
  };
}

function getHeaders(sheet) {
  const width = Math.max(sheet.getLastColumn(), 1);
  return sheet.getRange(1, 1, 1, width).getDisplayValues()[0]
    .map(function (header) { return String(header || "").trim(); });
}

function forceResponseTableTextColumns() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getResponseSheet();
  const spreadsheetId = spreadsheet.getId();
  const apiUrl = "https://sheets.googleapis.com/v4/spreadsheets/" + encodeURIComponent(spreadsheetId);
  const headers = {
    Authorization: "Bearer " + ScriptApp.getOAuthToken()
  };
  const response = UrlFetchApp.fetch(
    apiUrl + "?fields=sheets(properties(sheetId),tables(tableId,range,columnProperties))",
    { headers: headers, muteHttpExceptions: true }
  );

  if (response.getResponseCode() >= 300) {
    throw new Error("Could not read Google Table column types: " + response.getContentText());
  }

  const workbook = JSON.parse(response.getContentText());
  const sheetResource = (workbook.sheets || []).find(function (item) {
    return item.properties && item.properties.sheetId === sheet.getSheetId();
  });
  if (!sheetResource || !sheetResource.tables || !sheetResource.tables.length) return false;

  const textHeaders = {
    "Phone / WhatsApp": true,
    Email: true,
    "Source Page": true,
    "Phone Code": true,
    "Local Phone": true
  };
  const requests = [];

  sheetResource.tables.forEach(function (table) {
    const columnProperties = (table.columnProperties || []).map(function (column) {
      const updated = {
        columnIndex: column.columnIndex,
        columnName: column.columnName,
        columnType: textHeaders[column.columnName] ? "TEXT" : column.columnType
      };
      if (!textHeaders[column.columnName] && column.dataValidationRule) {
        updated.dataValidationRule = column.dataValidationRule;
      }
      return updated;
    });

    requests.push({
      updateTable: {
        table: {
          tableId: table.tableId,
          columnProperties: columnProperties
        },
        fields: "columnProperties"
      }
    });
  });

  if (!requests.length) return false;
  const updateResponse = UrlFetchApp.fetch(apiUrl + ":batchUpdate", {
    method: "post",
    contentType: "application/json",
    headers: headers,
    payload: JSON.stringify({ requests: requests }),
    muteHttpExceptions: true
  });
  if (updateResponse.getResponseCode() >= 300) {
    throw new Error("Could not change Google Table columns to Text: " + updateResponse.getContentText());
  }
  return true;
}

function recoverPhoneText(displayValue, formulaValue) {
  const display = String(displayValue || "").trim();
  if (display && display !== "#ERROR!") {
    return display;
  }

  const formula = String(formulaValue || "").trim();
  if (!formula) {
    return display.replace(/^#ERROR!$/, "");
  }

  const cleaned = formula.replace(/^=/, "").trim();
  if (cleaned) {
    return cleaned;
  }

  return display.replace(/^#ERROR!$/, "");
}
