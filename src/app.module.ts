import { HttpStrictTransportSecurityMiddleware } from './middleware/security/http-strict-transport-security.middleware';
import { ContentSecurityPolicyMiddleware } from './middleware/security/content-security-policy.middleware';
import { XContentTypeOptionsMiddleware } from './middleware/security/x-content-type-options.middleware';
import { SubscriptionPlanEntity } from './modules/subscription/entities/subscription-plan.entity';
import { LoggingFunctions } from './utils/interceptor/activityLogging/activity-logging.function';
import { MiddlewareConsumer, Module, NestModule, RequestMethod, Scope } from '@nestjs/common';
import { LoggingInterceptor } from './utils/interceptor/activityLogging/logging.interceptor';
import { XssProtectionMiddleware } from './middleware/security/x-xss-protection.middleware';
import { ReferrerPolicyMiddleware } from './middleware/security/referrer-policy.middleware';
import { XFrameOptionsMiddleware } from './middleware/security/x-frame-options.middleware';
import { MicroServiceHealthCheckService } from './microservice-health-check.service';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { DatabaseModule } from './modules/database/connection/database.module';
import { HttpExceptionFilter } from './utils/filters/http-exeception.filter';
import { CompressionMiddleware } from './middleware/compression.middleware';
import { NotificationModule } from './notification/notification.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ConfigModule as EnvConfigModule } from '@nestjs/config';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PaymentModule } from './modules/payment/payment.module';
import { entitiesList } from './entitiesList/entities.list';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './modules/auth/auth.module';
import { Seeder } from './utils/seeder/seeder.service';
import { ShutdownService } from './shutdown.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import 'dotenv/config';


@Module({
  imports: [
    EventEmitterModule.forRoot(), // Import EventEmitterModule
    ScheduleModule.forRoot(),
    EnvConfigModule.forRoot(), // initializing config module for whole module,
    // Module listing
    InvoiceModule,
    PaymentModule,
    CustomerModule,
    TerminusModule,
    SubscriptionModule,
    NotificationModule,
    DatabaseModule.forRoot({ entities: entitiesList }),
    TypeOrmModule.forFeature([SubscriptionPlanEntity]),
    AuthModule,

  ],
  controllers: [AppController],
  providers: [
    Seeder,
    AppService,
    ShutdownService,
    LoggingFunctions,
    MicroServiceHealthCheckService,
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly seeder: Seeder) { }
  // This hook will run after the application has initialized and TypeORM has synchronized.
  async onModuleInit() {
    // Seed database after synchronization
    await this.seeder.seed();
  }

  configure(consumer: MiddlewareConsumer) { // this configure function here get access to this middleware consumer 
    consumer?.apply(
      AuthenticationMiddleware,
      ContentSecurityPolicyMiddleware,
      HttpStrictTransportSecurityMiddleware,
      XFrameOptionsMiddleware,
      XContentTypeOptionsMiddleware,
      XssProtectionMiddleware,
      ReferrerPolicyMiddleware
    )?.forRoutes('*');
    consumer?.apply(CompressionMiddleware)?.forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
