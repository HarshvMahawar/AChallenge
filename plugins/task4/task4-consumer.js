const { kafka } = require('../../client');

async function processSMSNotifications() {
    try {
        const consumer = kafka.consumer({ groupId: 'sms-notifications-group' });
        await consumer.connect();

        const topic = 'task4-sms-confirmation';

        // Subscribe to the specified topic and start consuming messages
        await consumer.subscribe({ topic, fromBeginning: true });

        await consumer.run({
            // Process each received message
            eachMessage: async ({ topic, partition, message }) => {
                const customerDetails = JSON.parse(message.value.toString());
                console.log(`Received SMS notification for customer: ${customerDetails.name}`);
                // Services like Twilio can be used for messaging
            },
        });
    } catch (error) {
        console.error(`Error processing SMS notifications: ${error.message}`);
    } finally {
        // Perform any cleanup or finalization steps if needed
    }
}

processSMSNotifications();

