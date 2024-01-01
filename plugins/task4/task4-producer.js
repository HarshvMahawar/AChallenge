// sms_notification_producer.js
const { kafka } = require('../../client');

async function sendSMSNotifications() {
    const producer = kafka.producer();
    try {
        await producer.connect();

        const topic = 'task4-sms-confirmation';

        for (let i = 1; i <= 10000; i++) {
        const customerDetails = {
            customerId: `id_${i}`,
            name: `Customer_${i}`,
            phoneNumber: `+1234567${i}`,
        };

        await producer.send({
            topic,
            messages: [
            {
                value: JSON.stringify(customerDetails),
            },
            ],
        });

        console.log(`SMS notification sent for customer ${customerDetails.name}`);
        }

        console.log('All SMS notifications sent successfully');
  } catch (error) {
    console.error(`Error sending SMS notifications: ${error.message}`);
  } finally {
    await producer.disconnect();
  }
}


sendSMSNotifications();
