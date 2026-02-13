// ============================================================
// Google Apps Script — Pub Quiz Bern Registration Handler
// ============================================================
//
// SETUP:
// 1. Go to https://script.google.com and create a new project
// 2. Paste this entire file into the editor (replace any existing code)
// 3. Click "Deploy" → "New deployment"
// 4. Choose type: "Web app"
// 5. Set "Execute as": Me
// 6. Set "Who has access": Anyone
// 7. Click "Deploy" and copy the Web App URL
// 8. Create a file "form-config.js" in your website folder with:
//      window.PUB_QUIZ_FORM_ENDPOINT = "YOUR_WEB_APP_URL_HERE";
//    and add <script src="form-config.js"></script> before app.js in index.html
//
// The script will automatically create a Google Sheet named
// "Pub Quiz Anmeldungen" in your Google Drive on first submission.
// ============================================================

var SHEET_NAME = 'Pub Quiz Anmeldungen';

function getOrCreateSheet() {
  var files = DriveApp.getFilesByName(SHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  var ss = SpreadsheetApp.create(SHEET_NAME);
  var sheet = ss.getActiveSheet();
  sheet.appendRow(['Timestamp', 'Event', 'Teamname', 'Kontaktperson', 'E-Mail', 'Gruppengrösse', 'Bemerkung']);
  // Bold header row
  sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  // Auto-resize columns
  for (var i = 1; i <= 7; i++) sheet.autoResizeColumn(i);
  return ss;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = getOrCreateSheet();
    var sheet = ss.getActiveSheet();

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.event || '',
      data.teamname || '',
      data.contact || '',
      data.email || '',
      data.groupsize || '',
      data.note || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: handle GET requests to verify the script is deployed
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Pub Quiz form endpoint is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
