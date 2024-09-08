import { Injectable, NestMiddleware } from '@nestjs/common';
import * as compression from 'compression';

@Injectable()

// the CompressionMiddleware class serves as a wrapper around the compression library, providing a middleware that compresses the HTTP responses in a NestJS application. It is typically used to reduce the size of response payloads and improve network performance by enabling compression techniques such as Gzip or Deflate.
export class CompressionMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        try {
            compression()(req, res, next);
        } catch (error) {
            console.error(error, 'CompressionMiddleware Error');
        }
    }
}
