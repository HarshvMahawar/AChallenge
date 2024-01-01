const { kafka } = require("./client");


async function init() {
    const admin = kafka.admin();
    console.log('Admin connection...');
    admin.connect();
    console.log("Admin connected...");
    // Created 4 topics according to tasks, more topics can be created according to use cases
    await admin.createTopics({
        topics: [
            { topic: "task1-slangs-identification", numPartitions: 2 },
            { topic: "task2-businessrule-validation", numPartitions: 2 },
            { topic: "task3-google-sheets-integration", numPartitions: 2 },
            { topic: "task4-sms-confirmation", numPartitions: 2 },
            
        ]
    });

    console.log("Topic created 'task1-slangs-identification', 'task2-businessrule-validation', 'task3-google-sheets-integration, 'task4-sms-confirmation'");
    console.log("disconnecting admin");
    await admin.disconnect();
    console.log("admin disconncted");

}

init();



