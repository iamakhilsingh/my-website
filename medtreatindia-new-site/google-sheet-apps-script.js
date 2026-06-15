const SHEET_NAME = "Responses";

function doPost(e) {
  const sheet = getResponseSheet();
  const data = JSON.parse(e.postData.contents || "{}");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At",
      "Name",
      "Country",
      "Phone / WhatsApp",
      "Email",
      "Treatment",
      "Message",
      "Budget",
      "Preferred Date",
      "Source Page"
    ]);
  }

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.name || "",
    data.country || "",
    data.phone || "",
    data.email || "",
    data.treatment || "",
    data.message || "",
    data.budget || "",
    data.date || "",
    data.sourcePage || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getResponseSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}
