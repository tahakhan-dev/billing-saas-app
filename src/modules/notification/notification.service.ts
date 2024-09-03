import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../customer/entities/customer.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity) private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>,

  ) { }

  async create(createNotificationDto: CreateNotificationDto): Promise<NotificationEntity> {
    const { customerId, ...notificationDetails } = createNotificationDto;

    // Check if customer 
    const existingCustomer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!existingCustomer) {
      throw new NotFoundException(`no customer found .`);
    }

    const notification = this.notificationRepository.create({ customerId, ...notificationDetails });
    await this.notificationRepository.save(notification);
    return notification;
  }

  async findById(id: number): Promise<NotificationEntity | undefined> {
    return await this.notificationRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

}
