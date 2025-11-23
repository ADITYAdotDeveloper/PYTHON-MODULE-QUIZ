/**
 * Google Apps Script Backend for Python Modules Quiz
 * 
 * INSTRUCTIONS:
 * 1. Paste this code into your Google Apps Script editor (Extensions > Apps Script).
 * 2. Save.
 * 3. Click Deploy > New Deployment.
 * 4. Select Type: Web App.
 * 5. Execute as: "Me".
 * 6. Who has access: "Anyone".
 * 7. Click Deploy and use the resulting URL in your frontend constants.ts.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait shorter time for lock to avoid freezing UI if backend is busy
  try {
    lock.waitLock(10000); 
  } catch (e) {
    return createResponse({ status: "error", message: "Server is busy" });
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the POST body
    var postContent = e.postData.contents;
    var data;
    
    try {
      data = JSON.parse(postContent);
    } catch (parseErr) {
      return createResponse({ status: "error", message: "Invalid JSON format" });
    }
    
    // Validate required fields
    if (!data.name || data.score === undefined || !data.timestamp || !data.quote) {
       return createResponse({ status: "error", message: "Missing required fields" });
    }

    // Append row: timestamp, name, score, quote
    sheet.appendRow([data.timestamp, data.name, data.score, data.quote]);

    return createResponse({ status: "success", message: "Row added" });

  } catch (err) {
    return createResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var data = [];

    // Assuming Row 1 is header, start loop from Row 2 (index 1)
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      
      // Safety check: ensure the row has at least a timestamp and a name
      if (row[0] && row[1]) {
        var timestamp = row[0];
        
        // Fix: Explicitly convert Date objects to ISO Strings
        // Google Sheets returns Date objects for date cells, which allows correct sorting later
        if (timestamp instanceof Date) {
          timestamp = timestamp.toISOString();
        }

        data.push({
          timestamp: timestamp,
          name: row[1],
          score: Number(row[2]), // Ensure score is a number
          quote: row[3]
        });
      }
    }

    return createResponse({ status: "success", data: data });

  } catch (err) {
    return createResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Helper to return JSON response with correct mime type and headers
 */
function createResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this function once to initialize the sheet headers manually if needed
 */
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  sheet.appendRow(["timestamp", "name", "score", "quote"]);
}