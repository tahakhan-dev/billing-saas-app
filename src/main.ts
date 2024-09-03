import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SYSTEM_CONSTANT } from './common/constants';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const cluster = require("cluster")

async function bootstrap() {
  try {
    const APP_PORT = process?.env?.PORT;

    const app = await NestFactory.create(AppModule, {
      snapshot: true, // This will instruct the framework to collect necessary metadata that will let Nest Devtools visualize your application's graph.
      abortOnError: false,
    });
    // Enable CORS
    app.use(cors());
    app.use(helmet());

    app.enableVersioning({
      type: VersioningType.HEADER,
      header: 'X-API-Version', // Set the header key as 'X-API-Version'
    });

    app.useGlobalPipes(
      // Here, we are setting transform to true to enable automatic data transformation and whitelist to true to strip any properties that are not decorated with validation decorators
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    app.setGlobalPrefix(SYSTEM_CONSTANT.GLOABAL_API_PREFIX);

    // This function enables the automatic handling of shutdown signals or events by registering shutdown hooks in the application.
    app.enableShutdownHooks();

    const config = new DocumentBuilder()
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        in: 'header',
      })
      .setTitle('SaaS Billing API')
      .setDescription('API for managing SaaS billing')
      .setVersion('1.0')
      .addTag('Billing')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api_docs', app, document);


    await app.listen(APP_PORT, () => {
      console.log(`API GATEWAY IS RUNNING ON ${APP_PORT}`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('SIGINT signal received. Closing HTTP server...');
      await app.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received. Closing HTTP server...');
      await app.close();
      process.exit(0);
    });

  } catch (error) {
    console.error(error, '================== Bootstrap Function ===============');
  }
}
// creating cluster for this appliation 
if (cluster.isMaster && process.env.CLUSTER_ENV === 'qa') {
  const numWorkers = 3;

  console.log(`Master cluster setting up ${numWorkers} workers...`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
  });

  // Handle shutdown
  process.on('SIGINT', () => {
    console.log('SIGINT signal received. Shutting down master...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill('SIGINT');
    }
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Shutting down master...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill('SIGTERM');
    }
    process.exit(0);
  });

} else {
  bootstrap();
}
