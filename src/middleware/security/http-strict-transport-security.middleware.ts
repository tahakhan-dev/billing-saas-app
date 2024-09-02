import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
// import { KafkaService } from 'src/modules/kafka/kafka.service';
// import { KAFKA_CONSTANT } from 'src/helpers/constants';
import { Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class HttpStrictTransportSecurityMiddleware implements NestMiddleware {
  constructor(
    // @Inject(KafkaService) private readonly kafkaService: KafkaService,
  ) { }
  use(req: any, res: Response, next: () => void) {
    try {
      // Define HSTS options
      const hstsOptions = {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true, // Include subdomains
      };

      // Set HSTS header using Helmet
      helmet.hsts(hstsOptions)(req, res, () => {
        // Call the next middleware in the chain
        next();
      });
    } catch (error) {
      // this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { HttpStrictTransportSecurityMiddleware: error }, { fileName: Buffer.from(__filename), className: Buffer.from('HttpStrictTransportSecurityMiddleware'), methodName: Buffer.from('HttpStrictTransportSecurityMiddleware') }).then().catch((error) => console.error('Failed to send message:', error));
      console.error(error, "HttpStrictTransportSecurityMiddleware Error");
    }
  }
}