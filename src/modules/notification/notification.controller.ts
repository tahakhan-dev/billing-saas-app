import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationEntity } from './entities/notification.entity';


@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }


  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a new notification' })
  @ApiResponse({ status: 201, description: 'Notification sent successfully.' })
  public async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all notifications' })
  @ApiResponse({ status: 200, description: 'Returned all notifications successfully', type: [NotificationEntity] })
  async getAllNotifications(): Promise<NotificationEntity[]> {
      return await this.notificationService.findAll();
  }


  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific notification by ID' })
  @ApiResponse({ status: 200, description: 'Notification retrieved successfully', type: NotificationEntity })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Notification ID' })
  async getNotificationById(@Param('id') id: number): Promise<NotificationEntity> {
    const notification = await this.notificationService.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found.`);
    }
    return notification;
  }
}
