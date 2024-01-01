// Implementing batch processing consumer to counter writing limits of Google sheets API
const { kafka } = require('../../client');
const { generateClient } = require('./g-sheet-client');
const config = require('./config');
const { google } = require('googleapis');

const MAX_BATCH_SIZE = 50; // Can be adjusted

let batchBuffer = [];

async function updateGoogleSheetBatch(formResponses) {
  try {
    const client = await generateClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const { sheetId, sheetName } = config.googleSheet;

    // Read existing data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetName,
    });

    // Find the next empty row in the sheet
    const rowIndex = response.data.values ? response.data.values.length + 1 : 1;

    // Prepare the form response data to be written to the sheet
    const rowData = formResponses.map((formResponse) => [
      formResponse.question1,
      formResponse.question2,
      formResponse.question3,
      // Add more columns as needed
    ]);

    // Update the sheet with the form response data in a batch
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${rowIndex}`,
      valueInputOption: 'RAW',
      resource: {
        values: rowData,
      },
    });

    console.log(`Form responses added to Google Sheets: ${JSON.stringify(formResponses)}`);
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
        batchBuffer.push(formResponse);

        // Check if the batch size is reached
        if (batchBuffer.length >= MAX_BATCH_SIZE) {
          await updateGoogleSheetBatch(batchBuffer);
          // Clear the batch buffer
          batchBuffer = [];
        }
      },
    });
  } catch (error) {
    console.error(`Error consuming form responses: ${error.message}`);
  } finally {
    // Disconnect consumer in the end
    // console.log('Disconnecting consumer...');
    // await consumer.disconnect();
    // console.log('Consumer disconnected');
  }
}


consumeFormResponses();
