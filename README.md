## Installation guide
- You will need to have docker and nodejs installed
### Commands
- Start Zookeper Container and expose PORT `2181`.
```bash
docker run -p 2181:2181 zookeeper
```
- Start Kafka Container, expose PORT `9092` and setup ENV variables.
```bash
docker run -p 9092:9092 \
-e KAFKA_ZOOKEEPER_CONNECT=<PRIVATE_IP>:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<PRIVATE_IP>:9092 \
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
confluentinc/cp-kafka
```
- Clone or download this repo and install the dependencies using
```bash
cd path_to_project_directory/
npm install
```
- Set up the Kafka Client by updating the project_root/client.js (add the IP Address where Kafka server is running.
```bash
project_root/client.js
```
- Download Google OAuth Credentials from https://developers.google.com/sheets/api/quickstart/nodejs and save it by renaming to credentials.json in the project root
```bash
project_root/credentials.json
```
- Update the Google Sheets config file by setting up the sheet id and sheet name where the form responses will be stored
```bash
project_root\plugins\task3-google-sheets\config.js
```
- Everything is set, now create Kafka topics using following command
```bash
node project_root/admin.js
```
- Now you can run start any consumer (it will remain started till you it terminate by Ctrl+C) in one terminal using following command
- It will also show some warnings at start, but ignore them.
```bash
node .\plugins\task1\task1-consumer.js
```
- and simultaneously in other terminal start producing messages using following command
```bash
node .\plugins\task1\task1-producer.js
```
- Now you can observe that consumer has started recieving the messages!, you can implement various amazing logics for processing the recieved messages.
- After running the task3-google-sheets consumer, you will be prompted to authorize the Google Sheets API, please use the same gmail account you used for creating the OAuth (or the account you added for testing) for authorizing.

Thats all, Thank you!
