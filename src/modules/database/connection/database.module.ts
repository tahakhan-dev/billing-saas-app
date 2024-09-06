import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigDBData } from '../config/config.interface';
import { ConfigService } from '../config/config.service';
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DataSourceOptions } from 'typeorm';
import { DbConfigError } from './db.error';
import { DbConfig } from './db.interface';

@Module({})
export class DatabaseModule {
    static forRoot(dbconfig: DbConfig): DynamicModule {
        try {
            return {
                global: true,
                module: DatabaseModule,
                imports: [
                    TypeOrmModule.forRootAsync({
                        imports: [ConfigModule],
                        useFactory: (configService: ConfigService) =>
                            DatabaseModule.getConnectionOptions(configService, dbconfig),
                        inject: [ConfigService],
                    }),
                ],
            };
        } catch (error) {
            console.error(error, '========DatabaseModule forRoot Function========');
        }
    }

    public static getConnectionOptions(config: ConfigService, dbconfig: DbConfig): TypeOrmModuleOptions {
        try {
            const dbdata = config?.get()?.db;

            let connectionOptions: TypeOrmModuleOptions;

            if (!dbdata) {
                throw new DbConfigError('Database config is missing');
            }
            connectionOptions = this.getConnectionOptionsDatabase(dbdata);

            return {
                ...connectionOptions,
                entities: dbconfig?.entities,
                autoLoadEntities: JSON.parse(process?.env?.AUTO_LOAD_ENTITIES) || dbdata?.autoLoadEntities,
                logging: true,
                // extra: {
                //     "validateConnection": false,
                //     "trustServerCertificate": true
                // }
            };
        } catch (error) {
            console.error(error, '========DatabaseModule getConnectionOptions Function========');
        }
    }


    private static getConnectionOptionsDatabase(dbdata: ConfigDBData): DataSourceOptions {
        try {
            return {
                type: process?.env?.DB_TYPE || dbdata?.type,
                host: process?.env?.DB_HOST || dbdata?.host,
                port: +process?.env?.DB_PORT || dbdata?.port,
                username: process?.env?.DB_USER || dbdata?.user,
                password: process?.env?.DB_PASSWORD || dbdata?.pass,
                database: process?.env?.DB_DATABASE || dbdata?.name,
                synchronize: JSON.parse(process?.env?.ENABLE_AUTOMATIC_CREATION) || dbdata?.synchronize,
                poolSize: +process?.env?.POOL_SIZE || dbdata?.poolSize
                // autoLoadEntities: JSON.parse(process.env.AUTO_LOAD_ENTITIES) || dbdata.autoLoadEntities
            };
        } catch (error) {
            console.error(error, '========DatabaseModule getConnectionOptionsDatabase Function========');
        }
    }
}
