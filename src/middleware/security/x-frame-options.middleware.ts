import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class XFrameOptionsMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: () => void) {
        try {
            // Set X-Frame-Options header using Helmet
            helmet({ frameguard: { action: 'sameorigin' } })(req, res, () => {
                // Call the next middleware in the chain
                next();
            });
        } catch (error) {
            console.error(error, 'XFrameOptionsMiddleware Error');
        }
    }
}