// import { IDatabaseCacheKey } from "../cache/interface/database-cache-key.interface";
// import { KAFKA_CONSTANT, REDIS_DB_CACHE_CONSTANT } from "src/helpers/constants";
// import { KafkaService } from "src/modules/kafka/kafka.service";
// import { Inject, Injectable } from "@nestjs/common";
// import 'dotenv/config';

// @Injectable()
// export class DatabaseCacheKeys {
//     constructor(
//         @Inject(KafkaService) private readonly kafkaService: KafkaService,
//     ) { }
//     public fetchConsumerProfile(consumerId: number): IDatabaseCacheKey {
//         try {
//             return {
//                 id: `${REDIS_DB_CACHE_CONSTANT?.REDIS_FETCH_CONSUMER_PROFILE_DB_CACHE_KEY_PREFIX}_${consumerId}`,
//                 milliseconds: REDIS_DB_CACHE_CONSTANT?.REDIS_QUERY_MILLISECONDS
//             }
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { fetchConsumerProfile: error }, { fileName: Buffer.from(__filename), className: Buffer.from('DatabaseCacheKeys'), methodName: Buffer.from('fetchConsumerProfile') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'fetchConsumerProfile')
//         }

//     }
//     public getConsumerProfile(consumerId: number): IDatabaseCacheKey {
//         try {
//             return {
//                 id: `${REDIS_DB_CACHE_CONSTANT?.REDIS_GET_CONSUMER_PROFILE_DB_CACHE_KEY_PREFIX}_${consumerId}`,
//                 milliseconds: REDIS_DB_CACHE_CONSTANT?.REDIS_QUERY_MILLISECONDS
//             }
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { getConsumerProfile: error }, { fileName: Buffer.from(__filename), className: Buffer.from('DatabaseCacheKeys'), methodName: Buffer.from('getConsumerProfile') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'getConsumerProfile')
//         }
//     }

//     public getDbCacheConsumerProfile(consumerId: number): IDatabaseCacheKey {
//         try {
//             return {
//                 id: `${REDIS_DB_CACHE_CONSTANT?.SIGN_UP_OR_LOGIN}_${consumerId}`,
//                 milliseconds: REDIS_DB_CACHE_CONSTANT?.REDIS_QUERY_MILLISECONDS
//             }
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { getConsumerProfile: error }, { fileName: Buffer.from(__filename), className: Buffer.from('DatabaseCacheKeys'), methodName: Buffer.from('getConsumerProfile') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'getConsumerProfile')
//         }
//     }

// }
