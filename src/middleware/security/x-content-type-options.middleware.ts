import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
// import { KafkaService } from 'src/modules/kafka/kafka.service';
// import { KAFKA_CONSTANT } from 'src/helpers/constants';
import { Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class XContentTypeOptionsMiddleware implements NestMiddleware {
  constructor(
    // @Inject(KafkaService) private readonly kafkaService: KafkaService,
  ) { }
  use(req: any, res: Response, next: () => void) {
    try {
      // Set X-Content-Type-Options header using helmet
      helmet.contentSecurityPolicy({
        directives: {
          'default-src': ["'self'"],
        },
      })(req, res, () => {
        // Call the next middleware in the chain
        next();
      });
    } catch (error) {
      // this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { XContentTypeOptionsMiddleware: error }, { fileName: Buffer.from(__filename), className: Buffer.from('XContentTypeOptionsMiddleware'), methodName: Buffer.from('XContentTypeOptionsMiddleware') }).then().catch((error) => console.error('Failed to send message:', error));
      console.error(error, 'XContentTypeOptionsMiddleware Error');
    }
  }
}
