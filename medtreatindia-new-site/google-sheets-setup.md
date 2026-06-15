# Google Sheets Form Connection

This website is ready to submit consultation enquiries into Google Sheets.

## Setup

1. Create a Google Sheet for MedTreat India enquiries.
2. In that sheet, open Extensions > Apps Script.
3. Paste the code from `google-sheet-apps-script.js`.
4. Save the project.
5. Click Deploy > New deployment.
6. Choose Web app.
7. Set "Execute as" to "Me".
8. Set "Who has access" to "Anyone".
9. Copy the Web app URL.
10. Paste that URL into `script.js` here:

```js
const googleSheetEndpoint = "";
```

After the URL is added, every website form submission will add a new row to the `Responses` sheet.
