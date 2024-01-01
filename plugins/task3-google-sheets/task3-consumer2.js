// Another consumer with same logic to implement parallel processing of data
const { kafka } = require('../../client');
const { generateClient } = require('./g-sheet-client');
const config = require('./config');
const { google } = require('googleapis');

async function updateGoogleSheet(formResponse) {
  try {
    const client = await generateClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const { sheetId, sheetName } = config.googleSheet;

    // Reading existing data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetName,
    });

    // Find the next empty row in the sheet
    const rowIndex = response.data.values ? response.data.values.length + 1 : 1;

    // Preparing the form response data to be written to the sheet
    const rowData = [
      formResponse.question1,
      formResponse.question2,
      formResponse.question3,

    ];

    // Update the sheet with the form response data
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${rowIndex}`,
      valueInputOption: 'RAW',
      resource: {
        values: [rowData],
      },
    });

    console.log(`Form response added to Google Sheets: ${JSON.stringify(formResponse)}`);
  } catch (error) {
    console.error(`Error updating Google Sheets: ${error.message}`);
  }
}

async function consumeFormResponses() {
  const consumer = kafka.consumer({ groupId: 'task3-google-sheets-integration' });

  console.log('Connecting consumer...');
  await consumer.connect();
  console.log('Consumer connected');

  try {
    console.log(`Subscribing to topic: 'task3-google-sheets-integration'`);
    await consumer.subscribe({ topic: 'task3-google-sheets-integration', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const formResponse = JSON.parse(message.value.toString());
        await updateGoogleSheet(formResponse);
      },
    });
  } catch (error) {
    console.error(`Error consuming form responses: ${error.message}`);
  } finally {
    // console.log('Disconnecting consumer...');
    // await consumer.disconnect();
    // console.log('Consumer disconnected');
  }
}


consumeFormResponses();
