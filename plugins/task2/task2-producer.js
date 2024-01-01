const { kafka } = require('../../client');

async function generateBusinessRuleValidationResponses() {
  const producer = kafka.producer();

  console.log('Connecting producer...');
  await producer.connect();
  console.log('Producer connected');

  // Specify the Kafka topic for business rule validation responses
  const topic = 'task2-businessrule-validation';
  // Define the form definitions with questions
  const forms = [
    {
      formId: 'form2',
      questions: ['MonthlyIncome', 'MonthlySavings'],
    },

  ];

  try {
    console.log(`Generating business rule validation responses to topic: ${topic}`);
    for (let i = 1; i <= 5; i++) {
      // Randomly selecting a form definition
      const formIndex = Math.floor(Math.random() * forms.length);
      const formId = forms[formIndex].formId;
      const responseKey = `response-${formId}-${i}`;
      const responseValue = JSON.stringify({
        formId,
        responses: generateRandomResponses(forms[formIndex].questions),
      });

      // Send the Kafka message with the key and value
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

    console.log('Business rule validation responses generated successfully');
  } catch (error) {
    console.error(`Error generating business rule validation responses: ${error.message}`);
  } finally {

    await producer.disconnect();

  }
}

// Function to generate random responses based on question types
function generateRandomResponses(questions) {
  const responses = {};
  questions.forEach((question) => {
    if (question === 'MonthlyIncome') {
      responses[question] = Math.floor(Math.random() * 10000) + 5000; // Example range for income
    } else if (question === 'MonthlySavings') {
      responses[question] = Math.floor(Math.random() * 5000); // Example range for savings
    }
  });
  return responses;
}


generateBusinessRuleValidationResponses();
