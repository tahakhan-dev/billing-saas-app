import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
// import { KafkaService } from 'src/modules/kafka/kafka.service';
// import { KAFKA_CONSTANT } from 'src/helpers/constants';
import { Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class XFrameOptionsMiddleware implements NestMiddleware {
    constructor(
        // @Inject(KafkaService) private readonly kafkaService: KafkaService,
    ) { }
    use(req: any, res: Response, next: () => void) {
        try {
            // Set X-Frame-Options header using Helmet
            helmet({ frameguard: { action: 'sameorigin' } })(req, res, () => {
                // Call the next middleware in the chain
                next();
            });
        } catch (error) {
            // this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { XFrameOptionsMiddleware: error }, { fileName: Buffer.from(__filename), className: Buffer.from('XFrameOptionsMiddleware'), methodName: Buffer.from('XFrameOptionsMiddleware') }).then().catch((error) => console.error('Failed to send message:', error));
            console.error(error, 'XFrameOptionsMiddleware Error');
        }
    }
}