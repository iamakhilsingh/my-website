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

## After updating this file later

If you change `google-sheet-apps-script.js`, paste the updated code into Apps Script again, then deploy a new web app version with access set to "Anyone". The website can send the latest phone fields only after the Apps Script deployment is updated.

The script preserves any column order you choose and adds missing columns automatically. The supported columns are:

- Submitted At
- Name
- Country
- Phone / WhatsApp
- Email
- Email Status
- Treatment
- Message
- Budget
- Preferred Date
- Source Page
- City
- Age / DOB
- Phone Code
- Local Phone

After pasting and authorizing the updated script, reload the Google Sheet and choose **MedTreat Tools > Repair existing responses**. You can also run `repairExistingResponses` once inside Apps Script. It:

- repairs old phone `#ERROR!` cells;
- changes Phone, Email, and Source Page table columns to plain text;
- normalizes recoverable email addresses and marks the rest as `Needs review` or `Missing`;
- replaces bare `/` and local file paths with the matching `https://www.medtreatindia.com/...` source URL;
- fills the Phone Code and Local Phone columns for older rows.
