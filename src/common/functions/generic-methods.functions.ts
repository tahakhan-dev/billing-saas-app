// import { KafkaService } from "src/modules/kafka/kafka.service";
// import { KAFKA_CONSTANT } from "src/helpers/constants";
// import { Inject, Injectable } from "@nestjs/common";
// import { Response } from 'express';

// @Injectable()
// export class GenericFunctions {  // class related to token 
//     constructor(
//         @Inject(KafkaService) private readonly kafkaService: KafkaService,
//     ) { }

//     settingResponseHeader(response: Response, headerKey: string[], headerValue: string[]) {
//         try {
//             if (headerKey?.length !== headerValue?.length) {
//                 throw new Error('Array must have the same length')
//             }
//             for (let i = 0; i < headerKey?.length; i++) {
//                 response?.setHeader(headerKey[i], headerValue[i])
//             }
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { settingResponseHeader: error }, { fileName: Buffer.from(__filename), className: Buffer.from('GenericFunctions'), methodName: Buffer.from('settingResponseHeader') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'settingResponseHeader')
//         }

//     }
// }
