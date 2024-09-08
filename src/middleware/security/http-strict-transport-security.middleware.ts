import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class HttpStrictTransportSecurityMiddleware implements NestMiddleware {
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
      console.error(error, "HttpStrictTransportSecurityMiddleware Error");
    }
  }
}