import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { CustomerEntity } from '../customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, CustomerEntity])
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule { }
