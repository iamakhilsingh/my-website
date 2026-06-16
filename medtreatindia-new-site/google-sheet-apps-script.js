const SHEET_NAME = "Responses";
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
  "Budget",
  "Preferred Date",
  "Source Page"
];

function doPost(e) {
  const sheet = getResponseSheet();
  const data = parsePayload(e);
  const phoneCode = data.phoneCode || "";
  const localPhone = data.localPhone || "";
  const phoneFull = data.phoneFull || data.phone || [phoneCode, localPhone].filter(Boolean).join(" ");

  ensureHeaders(sheet);

  const row = [
    data.submittedAt || new Date().toISOString(),
    data.name || "",
    data.country || "",
    asPlainText(phoneCode),
    asPlainText(localPhone),
    asPlainText(phoneFull),
    data.email || "",
    data.treatment || "",
    data.message || "",
    data.budget || "",
    data.date || "",
    data.sourcePage || ""
  ];
  const nextRow = sheet.getLastRow() + 1;

  sheet.getRange(nextRow, 4, 1, 3).setNumberFormat("@");
  sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function parsePayload(e) {
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
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

function asPlainText(value) {
  return String(value || "").trim().replace(/^'/, "");
}

function repairLegacyPhoneErrors() {
  const sheet = getResponseSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const phoneRange = sheet.getRange(2, 4, lastRow - 1, 1);
  const formulas = phoneRange.getFormulas();
  const displayValues = phoneRange.getDisplayValues();
  const currentValues = phoneRange.getValues();
  const repairedValues = currentValues.map(function (row, index) {
    const formula = formulas[index][0];
    const displayValue = displayValues[index][0];
    const currentValue = row[0];

    if (displayValue === "#ERROR!" && formula) {
      return [formula.replace(/^=/, "").trim()];
    }

    return [String(currentValue || displayValue || "").trim().replace(/^'/, "")];
  });

  phoneRange.setNumberFormat("@");
  phoneRange.setValues(repairedValues);
}
