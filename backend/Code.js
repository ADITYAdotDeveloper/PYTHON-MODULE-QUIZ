/**
 * Google Apps Script Backend for Python Modules Quiz
 * 
 * IMPORTANT: After pasting this, you MUST click "Deploy" > "New Deployment".
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Wait for up to 10 seconds for other requests to finish
    lock.waitLock(10000); 
  } catch (e) {
    return createResponse({ status: "error", message: "Server busy, please try again." });
  }

  try {
    var sheet = getOrCreateSheet();
    
    // Parse the POST body
    var postContent = e.postData.contents;
    var data;
    
    try {
      data = JSON.parse(postContent);
    } catch (parseErr) {
      return createResponse({ status: "error", message: "Invalid JSON format." });
    }
    
    // Basic validation
    if (!data.name || data.score === undefined || !data.timestamp) {
       return createResponse({ status: "error", message: "Missing required fields (name, score, timestamp)." });
    }

    // Append the row safely
    // We treat everything as strings/numbers to ensure they stick in the sheet correctly
    sheet.appendRow([
      data.timestamp, 
      data.name, 
      Number(data.score), 
      data.quote || ""
    ]);

    return createResponse({ status: "success", message: "Score saved successfully." });

  } catch (err) {
    return createResponse({ status: "error", message: "Server Error: " + err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var rows = sheet.getDataRange().getValues();
    var data = [];

    // Row 0 is the header (timestamp, name, score, quote)
    // Start loop from Row 1
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      
      // Only add if we have at least a timestamp and a name
      if (row[0] && row[1]) {
        var timestampRaw = row[0];
        var timestampStr = "";

        // Robust Date to String conversion
        if (Object.prototype.toString.call(timestampRaw) === '[object Date]') {
           timestampStr = timestampRaw.toISOString();
        } else {
           timestampStr = String(timestampRaw);
        }

        data.push({
          timestamp: timestampStr,
          name: String(row[1]),
          score: Number(row[2]),
          quote: String(row[3] || "")
        });
      }
    }

    return createResponse({ status: "success", data: data });

  } catch (err) {
    return createResponse({ status: "error", message: "Fetch Error: " + err.toString() });
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // Initialize headers if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["timestamp", "name", "score", "quote"]);
  }
  return sheet;
}

function createResponse(payload) {
  // Return standard JSON response
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}