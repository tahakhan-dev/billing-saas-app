import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
// import { KafkaService } from 'src/modules/kafka/kafka.service';
// import { KAFKA_CONSTANT } from 'src/helpers/constants';
import { Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class ContentSecurityPolicyMiddleware implements NestMiddleware {
    constructor(
        // @Inject(KafkaService) private readonly kafkaService: KafkaService,
    ) { }
    use(req: any, res: Response, next: () => void) {
        try {
            // Define the desired CSP policies here
            const cspOptions = {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'"],
                },
            };

            // Set CSP header using Helmet
            helmet.contentSecurityPolicy(cspOptions)(req, res, () => {
                // Call the next middleware in the chain
                next();
            });
        } catch (error) {
            // this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { ContentSecurityPolicyMiddleware: error }, { fileName: Buffer.from(__filename), className: Buffer.from('ContentSecurityPolicyMiddleware'), methodName: Buffer.from('ContentSecurityPolicyMiddleware') }).then().catch((error) => console.error('Failed to send message:', error));
            console.error(error, 'ContentSecurityPolicyMiddleware Error');
        }
    }
}