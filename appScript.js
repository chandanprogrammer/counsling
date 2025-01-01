function doPost(e) {
  const DATA_ENTRY_SHEET_NAME = "Sheet1";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ENTRY_SHEET_NAME);

  function parseFormData(postData) {
    const data = {};
    const parameters = postData.split("&");
    for (let i = 0; i < parameters.length; i++) {
      const keyValue = parameters[i].split("=");
      data[keyValue[0]] = decodeURIComponent(keyValue[1] || "");
    }
    return data;
  }

  function appendToGoogleSheet(data) {
    if (!sheet) throw new Error(`Sheet "${DATA_ENTRY_SHEET_NAME}" not found.`);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowData = headers.map((header) => data[header] || "");
    sheet.appendRow(rowData);
  }

  try {
    const obj = JSON.parse(e.postData.contents); // Parse JSON
    const files = obj.files;
    const textData = parseFormData(obj.data); // Parse form data string

    appendToGoogleSheet(textData);

    // Find the "counslingimg" folder or create it if it doesn't exist
    let folder = DriveApp.getFoldersByName("counslingimg");
    if (!folder.hasNext()) {
      folder = DriveApp.createFolder("counslingimg");
    } else {
      folder = folder.next();
    }

    // Create the file in the "counslingimg" folder
    const links = files.map((file) => {
      const decode = Utilities.base64Decode(file.base64);
      const blob = Utilities.newBlob(decode, file.type, file.name);
      const newFile = folder.createFile(blob); // Create file in the folder
      return newFile
        .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
        .getDownloadUrl();
    });

    // Store links in the sheet
    const lr = sheet.getLastRow();
    links.forEach((link, index) => {
      sheet.getRange(lr, 11 + index).setFormula(`=IMAGE("${link}")`);
    });

    return ContentService.createTextOutput(
      JSON.stringify({ message: "Files uploaded successfully", links: links })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}



// const DATA_ENTRY_SHEET_NAME = "Sheet1";
// const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ENTRY_SHEET_NAME);

// function doPost(e) {
//   try {
//     const obj = JSON.parse(e.postData.contents);
//     const files = obj.files;

//     if (!Array.isArray(files) || files.length === 0) {
//       throw new Error("No files received in the request.");
//     }

//     const links = files.map((file) => {
//       const decode = Utilities.base64Decode(file.base64);
//       const blob = Utilities.newBlob(decode, file.type, file.name);
//       const newFile = DriveApp.createFile(blob);
//       return newFile
//         .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
//         .getDownloadUrl();
//     });

//     const lr = sheet.getLastRow();
//     links.forEach((link, index) => {
//       sheet.getRange(lr + 1, 11 + index).setFormula(`=IMAGE("${link}")`);
//     });

//     return ContentService.createTextOutput(
//       JSON.stringify({ message: "Files uploaded successfully", links: links })
//     ).setMimeType(ContentService.MimeType.JSON);
//   } catch (err) {
//     return ContentService.createTextOutput(
//       JSON.stringify({ error: err.toString() })
//     ).setMimeType(ContentService.MimeType.JSON);
//   }
// }
