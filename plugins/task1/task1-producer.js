const { kafka } = require('../../client');

async function generateFormResponses() {
  const producer = kafka.producer();

  console.log('Connecting producer...');
  await producer.connect();
  console.log('Producer connected');

  // Specified the Kafka topic for form responses
  const topic = 'task1-slangs-identification';

  // Sample form definition for testing
  const forms = [
    {
      formId: 'form1',
      questions: ['Question 1', 'Question 2', 'Question 3'],
    },

  ];

  try {
    console.log(`Generating form responses to topic: ${topic}`);
    
    // FOR TESTING PURPOSES, sending n number of responses
    for (let i = 1; i <= 100; i++) {
      const formIndex = Math.floor(Math.random() * forms.length);
      const formId = forms[formIndex].formId;
      const responseKey = `response-${formId}-${i}`;
      const responseValue = JSON.stringify({
        formId,
        responses: generateRandomResponses(forms[formIndex].questions),
      });

      // Send the form response to Kafka
      await producer.send({
        topic,
        messages: [
          {
            key: responseKey,
            value: responseValue,
          },
        ],
      });
    }

    console.log('Form responses generated successfully');
  } catch (error) {
    console.error(`Error generating form responses: ${error.message}`);
  } finally {
    console.log('Disconnecting producer...');
    await producer.disconnect();
    console.log('Producer disconnected');
  }
}

// Function to generate random responses for form questions
function generateRandomResponses(questions) {
  const responses = {};
  questions.forEach((question) => {
    responses[question] = getRandomResponse();
  });
  return responses;
}

// Function to get a random response option
function getRandomResponse() {
  const responses = ['Option A', 'Option B', 'Option C', 'Option D'];
  return responses[Math.floor(Math.random() * responses.length)];
}

generateFormResponses();
