// import { ConsumerProfileEntity } from '../../modules/users/entities/consumer-profile.entity';
// import { KafkaService } from 'src/modules/kafka/kafka.service';
// import { InjectCluster } from '@liaoliaots/nestjs-redis';
// import { Inject, Injectable } from '@nestjs/common';
// import { Cluster } from 'ioredis';
// import 'dotenv/config';
// import { KAFKA_CONSTANTS, REDIS_DB_CACHE_CONSTANT } from '../constants';


// @Injectable()
// export class CacheUserService {
//     constructor(
//         @InjectCluster() private readonly cluster: Cluster,
//         @Inject(KafkaService) private readonly kafkaService: KafkaService,
//     ) { }

//     async removeConsumerProfileKey(consumerId: number) {
//         try {
//             const deletePromise = [
//                 this.cluster.del(`${REDIS_DB_CACHE_CONSTANT?.REDIS_FETCH_CONSUMER_PROFILE_DB_CACHE_KEY_PREFIX}_${consumerId}`),
//                 this.cluster.del(`${REDIS_DB_CACHE_CONSTANT?.REDIS_GET_CONSUMER_PROFILE_DB_CACHE_KEY_PREFIX}_${consumerId}`)
//             ]
//             await Promise.all(deletePromise)
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANTS.KAFKA_TOPIC, { removeConsumerProfileKey: error }, { fileName: Buffer.from(__filename), className: Buffer.from('CacheUserService'), methodName: Buffer.from('removeConsumerProfileKey') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'removeConsumerProfileKey')
//         }
//     }
//     async removeRedisKey(key: string | any) {
//         try {
//             await this.cluster.del(key)
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANTS.KAFKA_TOPIC, { removeRedisKey: error }, { fileName: Buffer.from(__filename), className: Buffer.from('CacheUserService'), methodName: Buffer.from('removeRedisKey') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'removeRedisKey')
//         }
//     }

//     async addConsumerProfile(consumerId: number, data: ConsumerProfileEntity[], secret_key: string, consumerDeviceId: string) {
//         try {

//             let DeviceTokenArray: IDeviceToken[] = [], arrayofObject: ConsumerProfileEntity[], getProfileObject: ConsumerProfileEntity[]

//             arrayofObject = JSON.parse(JSON.stringify(data)); // JSON.stringify(data) is used to serialize the data array to a JSON string, and then JSON.parse() is used to deserialize the JSON string back into a new array, effectively creating a deep copy.
//             getProfileObject = JSON.parse(await this.cluster.get(`${REDIS_DB_CACHE_CONSTANT?.REDIS_ADD_CONSUMER_PROFILE_KEY_PREFIX}_${consumerId}`)); // getting consumerProfile from redis

//             if (getProfileObject) { // If the Redis cache value is not equal to null, perform the specified task. Otherwise, execute the corresponding actions in the else condition.
//                 const isDeviceTokenExist: number = getProfileObject[0]?.devicesToken?.findIndex(tokenObj => tokenObj?.deviceId === consumerDeviceId); // checking if device id exist or not 

//                 if (isDeviceTokenExist !== -1) { // if device id does not exist then remove it from DevicesToken token
//                     getProfileObject[0]?.devicesToken?.splice(isDeviceTokenExist, 1); // Remove the object at the found index
//                 }

//                 for (const deviceResponse of getProfileObject[0]?.devicesToken || []) {
//                     DeviceTokenArray?.push(deviceResponse); // After removing the device ID, push the remaining device IDs to another array called "DeviceTokenArray."
//                 }

//                 DeviceTokenArray?.push({ deviceId: consumerDeviceId, authToken: arrayofObject[0]?.authToken }) // now push new Device Id to this array
//                 arrayofObject[0].devicesToken = DeviceTokenArray // Initializing the "DeviceTokenArray" into the "devicesToken" array.
//             } else {
//                 arrayofObject[0].devicesToken = [{ deviceId: consumerDeviceId, authToken: arrayofObject[0]?.authToken }]
//             }

//             arrayofObject[0].tokenSecretKey = secret_key;
//             arrayofObject[0].authToken = ''

//             await this.cluster.set(`${REDIS_DB_CACHE_CONSTANT?.REDIS_ADD_CONSUMER_PROFILE_KEY_PREFIX}_${consumerId}`, JSON.stringify(arrayofObject), "EX", SYSTEM_CONSTANT.CACHE_TTL);
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANTS.KAFKA_TOPIC, { addConsumerProfile: error }, { fileName: Buffer.from(__filename), className: Buffer.from('CacheUserService'), methodName: Buffer.from('addConsumerProfile') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'addConsumerProfile')
//         }
//     }

//     async getConsumerProfileRedis(consumerId: number) {
//         try {
//             return await this.cluster.get(`${REDIS_DB_CACHE_CONSTANT?.REDIS_ADD_CONSUMER_PROFILE_KEY_PREFIX}_${consumerId}`);
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANTS.KAFKA_TOPIC, { getConsumerProfileRedis: error }, { fileName: Buffer.from(__filename), className: Buffer.from('CacheUserService'), methodName: Buffer.from('getConsumerProfileRedis') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'getConsumerProfileRedis')
//         }
//     }

//     async checkDeviceIdAndTokenIssueFromSameUser(consumerDeviceId: string, consumerId: number, encryptedToken: string): Promise<boolean> {
//         try {
//             let getProfileObject: ConsumerProfileEntity[];

//             getProfileObject = JSON.parse(await this.cluster.get(`${REDIS_DB_CACHE_CONSTANT?.REDIS_ADD_CONSUMER_PROFILE_KEY_PREFIX}_${consumerId}`));

//             if (!getProfileObject) return false

//             const isDeviceTokenExist: IDeviceToken = getProfileObject[0]?.devicesToken?.find(tokenObj => tokenObj?.deviceId === consumerDeviceId);

//             if (!isDeviceTokenExist) return false
//             if (isDeviceTokenExist?.authToken.length === 0) return false
//             if (encryptedToken !== isDeviceTokenExist?.authToken) return false
//             if (isDeviceTokenExist?.authToken == null || undefined) return false
//             if (isDeviceTokenExist?.deviceId !== consumerDeviceId) return false
//             return true
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANTS.KAFKA_TOPIC, { checkDeviceIdAndTokenIssueFromSameUser: error }, { fileName: Buffer.from(__filename), className: Buffer.from('CacheUserService'), methodName: Buffer.from('checkDeviceIdAndTokenIssueFromSameUser') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'checkDeviceIdAndTokenIssueFromSameUser')
//         }
//     }

// }