function doGet(req){
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Sheet1");
    var values = sheet.getDataRange().getValues();

    var output = [];
    for (var i = 0; i < values.length; i++) {
        let row = {};
        row['name'] = values[i][0];
        row['fatherName'] = values[i][1];
        row['email'] = values[i][2];
        row['dob'] = values[i][3];
        row['gender'] = values[i][4];
        row['category'] = values[i][5];
        row['phoneNo'] = values[i][6];
        row['formNo'] = values[i][7];
        row['cuetNo'] = values[i][8];
        row['cuetMarks'] = values[i][9];
        row['marksheet10th'] = values[i][10];
        row['marksheet12th'] = values[i][11];
        output.push(row);
    }
    return ContentService.createTextOutput(JSON.stringify({data: output})).setMimeType(ContentService.MimeType.JSON);
}
