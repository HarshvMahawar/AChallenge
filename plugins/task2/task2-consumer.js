const { kafka } = require('../../client');

async function consumeBusinessRuleValidationResponses() {
  const consumer = kafka.consumer({ groupId: 'business-rule-validation-group' });

  console.log('Connecting consumer...');
  await consumer.connect();
  console.log('Consumer connected');

  // Specify the Kafka topic for business rule validation responses
  const topic = 'task2-businessrule-validation';

  try {
    console.log(`Subscribing to topic: ${topic}`);
    // Subscribe to the specified Kafka topic and start consuming messages from the beginning
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const key = message.key.toString();
        const value = JSON.parse(message.value.toString());

        console.log(`Received message from topic ${topic}, partition ${partition}, key: ${key}, value:`, value);

        // Process the response and raised flag if needed
        processResponse(value);
      },
    });
  } catch (error) {
    console.error(`Error consuming business rule validation responses: ${error.message}`);
  } finally {
    // Log the disconnection (commented for now)
    // console.log('Disconnecting consumer...');
    
    // Log successful disconnection (commented for now)
    // console.log('Consumer disconnected');
  }
}

// Function to process the business rule validation response
function processResponse(response) {
  const monthlyIncome = response.responses.MonthlyIncome || 0;
  const monthlySavings = response.responses.MonthlySavings || 0;

  // Assumed a threshold for monthly income, adjust as needed
  const incomeThreshold = 8000;

  // Checking if monthly income is below the threshold
  if (monthlyIncome < incomeThreshold) {
    console.log(`Flag raised for response with MonthlyIncome below threshold: ${JSON.stringify(response)}`);

    // Notifying data collector (call the function to notify data collector)
    notifyDataCollector(response);
  }
}

// Function to notify the data collector about the flagged response
function notifyDataCollector(response) {
  // Logic to notify the data collector, APIs or external services can be used
  console.log('Notifying data collector about the flagged response:', response);
}

consumeBusinessRuleValidationResponses();
