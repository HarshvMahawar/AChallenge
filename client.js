const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
    clientId: 'Kafka',
    brokers: ['IP_ADDRESS:9092']
});