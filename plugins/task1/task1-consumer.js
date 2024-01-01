const { kafka } = require('../../client');

async function consumeFormResponses() {
  const consumer = kafka.consumer({ groupId: 'slangs-identification-group' });

  console.log('Connecting consumer...');
  
  await consumer.connect();
  
  console.log('Consumer connected');

  // Specified the topic from which to consume messages
  const topic = 'task1-slangs-identification';

  try {
    // Subscribed to the specified topic from the beginning
    console.log(`Subscribing to topic: ${topic}`);
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const key = message.key.toString();
        const value = JSON.parse(message.value.toString());

        console.log(`Received message from topic ${topic}, partition ${partition}, key: ${key}, value:`, value);
      },
    });
  } catch (error) {
    console.error(`Error consuming form responses: ${error.message}`);
  } finally {
    // console.log('Disconnecting consumer...');
    // For now, not disconnecting the consumer

    // await consumer.disconnect();
    
    console.log('Consumer disconnected');
  }
}

consumeFormResponses();
