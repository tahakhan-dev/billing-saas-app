import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
// import { KafkaService } from 'src/modules/kafka/kafka.service';
import { Request, Response, NextFunction } from 'express';
// import { KAFKA_CONSTANT } from 'src/helpers/constants';

@Injectable()
export class XssProtectionMiddleware implements NestMiddleware {
  constructor(
    // @Inject(KafkaService) private readonly kafkaService: KafkaService,
  ) { }
  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Set the X-XSS-Protection header
      res.setHeader('X-XSS-Protection', '1; mode=block');
      // Call the next middleware in the chain
      next();
    } catch (error) {
      // this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { XssProtectionMiddleware: error }, { fileName: Buffer.from(__filename), className: Buffer.from('XssProtectionMiddleware'), methodName: Buffer.from('XssProtectionMiddleware') }).then().catch((error) => console.error('Failed to send message:', error));
      console.error(error, 'XssProtectionMiddleware Error');
    }
  }
}