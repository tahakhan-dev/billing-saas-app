// // kafka.service.ts
// import { Kafka, Consumer, Producer, Message, IHeaders, Admin } from 'kafkajs';
// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { v4 as uuidv4 } from 'uuid';
// import { KAFKA_CONSTANT } from 'src/common/constants';

// @Injectable()
// export class KafkaService implements OnModuleInit, OnModuleDestroy {

//     private readonly kafka = new Kafka({
//         clientId: `${process?.env?.KAFKA_CLIENT_ID}-${uuidv4()}`,
//         brokers: [process?.env?.BROKER_IP],
//     });

//     private readonly producer: Producer = this.kafka.producer();
//     private readonly admin: Admin = this.kafka.admin();

//     // private readonly consumer: Consumer = this.kafka.consumer({ groupId: 'group-id' });

//     async onModuleInit() {
//         await this.producer.connect();
//         await this.admin.connect();

//         // Create all topics if they don't exist
//         for (const topic of Object.values(KAFKA_CONSTANT)) {
//             await this.createTopicIfNotExists(topic, 10, 2, 2);
//         }
//         // Disconnect admin after creating the topics
//         await this.admin.disconnect();

//         // await this.consumer.connect();
//     }

//     async onModuleDestroy() {
//         await this.producer.disconnect();
//         // await this.consumer.disconnect();
//     }

//     private async createTopicIfNotExists(topic: string, numPartitions: number, replicationFactor: number, minInSyncReplicas: number) {
//         const topics = await this.admin.listTopics();

//         if (!topics.includes(topic)) {
//             await this.admin.createTopics({
//                 topics: [
//                     {
//                         topic,
//                         numPartitions,
//                         replicationFactor,
//                         configEntries: [
//                             { name: 'min.insync.replicas', value: minInSyncReplicas?.toString() },
//                         ],
//                     },
//                 ],
//             });
//             console.log(`Topic "${topic}" created with ${numPartitions} partitions, replication factor ${replicationFactor}, and min in-sync replicas ${minInSyncReplicas}.`);
//         } else {
//             console.log(`Topic "${topic}" already exists.`);
//         }
//     }

//     async send(topic: string, message: any, headers?: IHeaders) {
//         const kafkaMessage: Message = {
//             value: JSON.stringify(message),
//             headers: headers,
//         };

//         await this.producer.send({
//             topic,
//             messages: [kafkaMessage],
//         });
//     }



//     //   async consumeMessages(topic: string, callback: (message: any) => void) {
//     //     await this.consumer.subscribe({ topic, fromBeginning: true });
//     //     await this.consumer.run({
//     //       eachMessage: async ({ message }) => {
//     //         callback(JSON.parse(message.value.toString()));
//     //       },
//     //     });
//     //   }
// }
