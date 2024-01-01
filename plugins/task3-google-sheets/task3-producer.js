const { kafka } = require('../../client');
const config = require('./config');

async function sendFormResponses() {
  let producer;

  try {
    producer = kafka.producer();
    await producer.connect();

    const topic = 'task3-google-sheets-integration';
    // Generating n numbers of sample form responses for testing
    for (let i = 1; i <= 200; i++) {
      const formResponse = {
        question1: getRandomOption(),
        question2: getRandomOption(),
        question3: getRandomOption(),
      };

      await producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(formResponse),
          },
        ],
      });

      console.log(`Form response sent: ${JSON.stringify(formResponse)}`);
    }

    console.log('All form responses sent successfully');
  } catch (error) {
    console.error(`Error sending form responses: ${error.message}`);
  } finally {
    if (producer) {
      await producer.disconnect();
    }
  }
}

function getRandomOption() {
  const options = ['A', 'B', 'C', 'D'];
  return options[Math.floor(Math.random() * options.length)];
}

sendFormResponses();
