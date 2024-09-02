// import { IDecryptWrapper } from '../../interface/base.response.interface';
// import { KafkaService } from 'src/modules/kafka/kafka.service';
// import { AuthService } from '../../modules/auth/auth.service';
// import { KAFKA_CONSTANT } from 'src/helpers/constants';
// import { Inject, Injectable } from '@nestjs/common';
// import { createHash } from 'crypto';
// import { Request } from 'express';

// @Injectable()
// export class TokenFunctions {  // class related to token 
//     constructor(
//         @Inject(AuthService) private readonly authService: AuthService,
//         @Inject(KafkaService) private readonly kafkaService: KafkaService,
//     ) { }

//     decryptUserToken(request: Request): IDecryptWrapper | any { // Decrypting the token extracted from the request header.
//         try {
//             const authorizationHeader: string = request?.headers['authorization']
//             if (authorizationHeader) {

//                 const consumerToken: string = authorizationHeader?.replace('Bearer', '')?.trim()
//                 let decryptToken: IDecryptWrapper = this.authService?.decodeJWT(consumerToken) as IDecryptWrapper
//                 return decryptToken
//             }
//             return true
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { decryptUserToken: error }, { fileName: Buffer.from(__filename), className: Buffer.from('TokenFunctions'), methodName: Buffer.from('decryptUserToken') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'decryptUserToken')
//         }
//     }


//     getDeviceIdFromHeader(request: Request): any {
//         try {
//             const deviceId = request?.headers['deviceid'] as string
//             return deviceId
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { getDeviceIdFromHeader: error }, { fileName: Buffer.from(__filename), className: Buffer.from('TokenFunctions'), methodName: Buffer.from('getDeviceIdFromHeader') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'getDeviceIdFromHeader')
//         }
//     }

//     generateDynamicJwtSecretKey(consumerId: number): any {
//         try {
//             const secretAttributes: number = consumerId;
//             const secretKey: string = createHash('sha256')?.update(JSON.stringify(secretAttributes))?.digest('hex');
//             return secretKey
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { generateDynamicJwtSecretKey: error }, { fileName: Buffer.from(__filename), className: Buffer.from('TokenFunctions'), methodName: Buffer.from('generateDynamicJwtSecretKey') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'generateDynamicJwtSecretKey')
//         }
//     }
// }
