const DATA_ENTRY_SHEET_NAME = "Sheet1";

const doPost = (request = {}) => {
  const { postData: { contents, type } = {} } = request;
  const data = parseFormData(contents);
  appendToGoogleSheet(data);
  return ContentService.createTextOutput(contents).setMimeType(
    ContentService.MimeType.JSON
  );
};

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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    DATA_ENTRY_SHEET_NAME
  );
  if (!sheet) throw new Error(`Sheet "${DATA_ENTRY_SHEET_NAME}" not found.`);

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = headers.map((header) => data[header] || "");
  sheet.appendRow(rowData);
}

// const DATA_ENTRY_SHEET_NAME = "Sheet1";
// var sheet = SpreadsheetApp.getActiveSpreadsheet.getSheetByName(DATA_ENTRY_SHEET_NAME);

// const doPost = (request = { }) => {
//   const {postData: {contents, type} ={}} = request;
//   var data = parseFormData(contents);
//   appendToGoggleSheet(data);
//   return ContentService.createTextOutput(contents).setMineType(ContentService.MimeType.JSON);

// };

// function parseFormData(postData){
//   var data = [];
//   var parameters = postData.split('&');
//   for(var i = 0; i<parameters.lenght; i++){
//     var keyValue = parameters[i].split('=');
//     data[keyValue[0]] = decodeURIComponent(keyValue[1]);
//   }
//   return data;
// }

// function appendToGoggleSheet(data){
//   var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
//   var rowData = headers.map(headerFld => data[headerFld]);
//   sheet.appendRow(rowData);
// }





// const DATA_ENTRY_SHEET_NAME = "Sheet1";
// const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ENTRY_SHEET_NAME);

// function doPost(e) {
//   function parseFormData(postData) {
//     const data = {};
//     const parameters = postData.split("&");
//     for (let i = 0; i < parameters.length; i++) {
//       const keyValue = parameters[i].split("=");
//       data[keyValue[0]] = decodeURIComponent(keyValue[1] || "");
//     }
//     return data;
//   }
//   function appendToGoogleSheet(data) {
//     if (!sheet) throw new Error(`Sheet "${DATA_ENTRY_SHEET_NAME}" not found.`);

//     const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
//     const rowData = headers.map((header) => data[header] || "");
//     sheet.appendRow(rowData);
//   }
//   try {
//     const obj = JSON.parse(e.postData.contents);
//     const files = obj.files;
//     const textData = obj.data;

//     if (!Array.isArray(files) || files.length === 0) {
//       throw new Error("No files received in the request.");
//     }

//     textData = parseFormData(textData);
//     appendToGoogleSheet(textData);

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
//   }
//   catch (err) {
//     return ContentService.createTextOutput(
//       JSON.stringify({ error: err.toString() })
//     ).setMimeType(ContentService.MimeType.JSON);
//   }
// }


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

    const links = files.map((file) => {
      const decode = Utilities.base64Decode(file.base64);
      const blob = Utilities.newBlob(decode, file.type, file.name);
      const newFile = DriveApp.createFile(blob);
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
