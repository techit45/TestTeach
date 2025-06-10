function doGet(e) {
  if (e.parameter.action === 'getInstructors') {
    const sheet = SpreadsheetApp.getActive().getSheetByName('instructors');
    const data = sheet.getDataRange().getValues();
    // Assume header: ศูนย์ | สัปดาห์ | วัน | ช่วงเวลา | ผู้สอน1 | ผู้สอน2
    let result = {};
    for (let i = 1; i < data.length; i++) {
      const [center, week, day, period, instructor1, instructor2] = data[i];
      if (!result[center]) result[center] = {};
      if (!result[center][week]) result[center][week] = {};
      if (!result[center][week][day]) result[center][week][day] = {};
      result[center][week][day][period] = { instructor1, instructor2 };
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('OK');
}