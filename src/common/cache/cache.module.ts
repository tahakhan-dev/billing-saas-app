import { KafkaModule } from 'src/modules/kafka/kafka.module';
// import { CacheUserService } from './cache-user.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [KafkaModule],
    providers: [
        // CacheUserService
    ],
    exports: [
        // CacheUserService
    ]
})
export class CacheModule { }