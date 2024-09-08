import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class XssProtectionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Set the X-XSS-Protection header
      res.setHeader('X-XSS-Protection', '1; mode=block');
      // Call the next middleware in the chain
      next();
    } catch (error) {
      console.error(error, 'XssProtectionMiddleware Error');
    }
  }
}