import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class ContentSecurityPolicyMiddleware implements NestMiddleware {
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
            console.error(error, 'ContentSecurityPolicyMiddleware Error');
        }
    }
}