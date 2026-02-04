/**
 * Custom Gems Workshop - Google Apps Script Backend API
 * Handles registration, gem ideas, showcase submissions, and feedback
 * Uses the SAME spreadsheet as the Vibe Coding Launchpad but with separate tabs
 */

// ==================== SHEET ID CONFIGURATION ====================
// Use the same Sheet ID as your Vibe Coding Launchpad spreadsheet
var SHEET_ID = 'YOUR_SHEET_ID_HERE';

function getSpreadsheet() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    if (SHEET_ID && SHEET_ID !== 'YOUR_SHEET_ID_HERE') {
      return SpreadsheetApp.openById(SHEET_ID);
    }
    throw new Error('No spreadsheet configured. Set SHEET_ID in Code.gs');
  }
}

// ==================== WEB APP ENTRY POINTS ====================

function doGet(e) {
  var output;
  try {
    var action = e.parameter.action || 'ping';
    var result;

    switch (action) {
      case 'ping':
        result = { success: true, message: 'Custom Gems Workshop API is running!' };
        break;
      case 'getGemIdeas':
        result = { success: true, data: getGemIdeas() };
        break;
      case 'getGemShowcase':
        result = { success: true, data: getGemShowcase() };
        break;
      case 'getGemsStats':
        result = { success: true, data: getGemsStats() };
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }

    output = ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    output = ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  return output;
}

function doPost(e) {
  var output;
  try {
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No data received');
    }

    var action = data.action || 'unknown';
    var result;

    switch (action) {
      case 'submitGemsRegistration':
        result = submitGemsRegistration(data);
        break;
      case 'submitGemIdea':
        result = submitGemIdea(data);
        break;
      case 'submitGemShowcase':
        result = submitGemShowcase(data);
        break;
      case 'submitGemsFeedback':
        result = submitGemsFeedback(data);
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }

    output = ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    output = ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  return output;
}

// ==================== REGISTRATION ====================

function submitGemsRegistration(data) {
  try {
    if (!data.name || !data.email || !data.role || !data.site) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('Gems-Registrations');

    if (!sheet) {
      sheet = ss.insertSheet('Gems-Registrations');
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Role', 'Site/Department']);
      formatHeaderRow(sheet, 5);
    }

    // Check for duplicate by email
    var existingData = sheet.getDataRange().getValues();
    for (var i = 1; i < existingData.length; i++) {
      if (existingData[i][2] && existingData[i][2].toString().toLowerCase() === data.email.toLowerCase()) {
        sheet.getRange(i + 1, 1, 1, 5).setValues([[
          new Date(), data.name, data.email, data.role, data.site
        ]]);
        return { success: true, message: 'Welcome back! Registration updated.' };
      }
    }

    sheet.appendRow([new Date(), data.name, data.email, data.role, data.site]);
    return { success: true, message: 'Registration successful!' };

  } catch (err) {
    Logger.log('Gems registration error: ' + err.message);
    return { success: false, message: 'Registration failed. Please try again.' };
  }
}

// ==================== GEM IDEAS (POLL) ====================

function submitGemIdea(data) {
  try {
    if (!data.gemIdea) {
      return { success: false, message: 'Please enter your Gem idea.' };
    }

    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('Gems-Ideas');

    if (!sheet) {
      sheet = ss.insertSheet('Gems-Ideas');
      sheet.appendRow(['Timestamp', 'Name', 'Gem Idea']);
      formatHeaderRow(sheet, 3);
    }

    sheet.appendRow([new Date(), data.name || 'Anonymous', data.gemIdea]);
    return { success: true, message: 'Idea submitted!' };

  } catch (err) {
    Logger.log('Gem idea submission error: ' + err.message);
    return { success: false, message: 'Submission failed. Please try again.' };
  }
}

function getGemIdeas() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('Gems-Ideas');

    if (!sheet || sheet.getLastRow() <= 1) return [];

    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
    var responses = [];

    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i][2]) {
        responses.push({
          name: data[i][1] || 'Anonymous',
          gemIdea: data[i][2]
        });
      }
    }
    return responses;

  } catch (err) {
    Logger.log('Get gem ideas error: ' + err.message);
    return [];
  }
}

// ==================== GEM SHOWCASE ====================

function submitGemShowcase(data) {
  try {
    if (!data.gemName || !data.description) {
      return { success: false, message: 'Please fill in the Gem name and description.' };
    }

    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('Gems-Showcase');

    if (!sheet) {
      sheet = ss.insertSheet('Gems-Showcase');
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Gem Name', 'Description', 'Audience', 'Share Link']);
      formatHeaderRow(sheet, 7);
    }

    sheet.appendRow([
      new Date(),
      data.name || 'Anonymous',
      data.email || '',
      data.gemName,
      data.description,
      data.audience || '',
      data.shareLink || ''
    ]);

    return { success: true, message: 'Gem submitted to the showcase!' };

  } catch (err) {
    Logger.log('Showcase submission error: ' + err.message);
    return { success: false, message: 'Submission failed. Please try again.' };
  }
}

function getGemShowcase() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('Gems-Showcase');

    if (!sheet || sheet.getLastRow() <= 1) return [];

    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
    var submissions = [];

    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i][3]) {
        submissions.push({
          name: data[i][1] || 'Anonymous',
          gemName: data[i][3],
          description: data[i][4] || '',
          audience: data[i][5] || '',
          shareLink: data[i][6] || ''
        });
      }
    }
    return submissions;

  } catch (err) {
    Logger.log('Get showcase error: ' + err.message);
    return [];
  }
}

// ==================== FEEDBACK ====================

function submitGemsFeedback(data) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('Gems-Feedback');

    if (!sheet) {
      sheet = ss.insertSheet('Gems-Feedback');
      sheet.appendRow([
        'Timestamp', 'Name', 'Email', 'Gem Plan', 'Confidence',
        'Priority Alignment', 'AI Teacher Support', 'Staff Training',
        'Session Rating', 'Comments'
      ]);
      formatHeaderRow(sheet, 10);
    }

    sheet.appendRow([
      new Date(),
      data.name || 'Anonymous',
      data.email || '',
      data.gemPlan || '',
      data.confidence || '',
      data.priorityAlignment || '',
      data.teacherSupport || '',
      data.staffTraining || '',
      data.sessionRating || '',
      data.comments || ''
    ]);

    return { success: true, message: 'Thank you for your feedback!' };

  } catch (err) {
    Logger.log('Gems feedback error: ' + err.message);
    return { success: false, message: 'Submission failed. Please try again.' };
  }
}

// ==================== STATS ====================

function getGemsStats() {
  var ss = getSpreadsheet();
  var stats = { registrations: 0, ideas: 0, showcase: 0, feedback: 0 };

  var regSheet = ss.getSheetByName('Gems-Registrations');
  if (regSheet) stats.registrations = Math.max(0, regSheet.getLastRow() - 1);

  var ideasSheet = ss.getSheetByName('Gems-Ideas');
  if (ideasSheet) stats.ideas = Math.max(0, ideasSheet.getLastRow() - 1);

  var showcaseSheet = ss.getSheetByName('Gems-Showcase');
  if (showcaseSheet) stats.showcase = Math.max(0, showcaseSheet.getLastRow() - 1);

  var fbSheet = ss.getSheetByName('Gems-Feedback');
  if (fbSheet) stats.feedback = Math.max(0, fbSheet.getLastRow() - 1);

  return stats;
}

// ==================== UTILITIES ====================

function formatHeaderRow(sheet, numColumns) {
  var headerRange = sheet.getRange(1, 1, 1, numColumns);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#6366F1'); // Indigo (Gems theme)
  headerRange.setFontColor('#ffffff');
  sheet.setFrozenRows(1);
}

function clearGemsSheetData(sheetName) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (sheet && sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
    Logger.log(sheetName + ' data cleared!');
  }
}
