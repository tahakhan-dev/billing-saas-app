import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { InjectCluster } from '@liaoliaots/nestjs-redis';
import { Cluster } from 'ioredis';

@Injectable() //makeing all injectable class so later on we can use this class as an nestjs DI container 
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(
        @InjectCluster() private readonly cluster: Cluster,
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        // Authenticate the request
        next();
    }
}
