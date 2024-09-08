import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class ReferrerPolicyMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: () => void) {
        try {
            // Set Referrer-Policy header using Helmet
            helmet.referrerPolicy({ policy: 'same-origin' })(req, res, () => {
                // Call the next middleware in the chain
                next();
            });
        } catch (error) {
            console.error(error, "ReferrerPolicyMiddleware Error");
        }
    }
}
