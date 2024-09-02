import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
// import { KafkaService } from 'src/modules/kafka/kafka.service';
import * as compression from 'compression';
import { KAFKA_CONSTANTS } from 'src/common/constants';

@Injectable()

// the CompressionMiddleware class serves as a wrapper around the compression library, providing a middleware that compresses the HTTP responses in a NestJS application. It is typically used to reduce the size of response payloads and improve network performance by enabling compression techniques such as Gzip or Deflate.
export class CompressionMiddleware implements NestMiddleware {
    constructor(
        // @Inject(KafkaService) private readonly kafkaService: KafkaService,
    ) { }
    use(req: any, res: any, next: () => void) {
        try {
            compression()(req, res, next);
        } catch (error) {
            // this.kafkaService.send(KAFKA_CONSTANTS.KAFKA_TOPIC, { CompressionMiddleware: error }, { fileName: Buffer.from(__filename), className: Buffer.from('CompressionMiddleware'), methodName: Buffer.from('CompressionMiddleware') }).then().catch((error) => console.error('Failed to send message:', error));
            console.error(error, 'CompressionMiddleware Error');
        }
    }
}
