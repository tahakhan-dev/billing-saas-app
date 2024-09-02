import { SYSTEM_CONSTANT } from 'src/common/constants';
import { DEFAULT__CACHE_CONFIG, NodeRole } from './cache_config.default';
import { ConfigData, ConfigCacheData } from './cache_config.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheConfigService {
    private config: ConfigData;

    constructor(data: ConfigData = DEFAULT__CACHE_CONFIG) {
        this.config = data;
    }

    public lofusingDotEnv() {
        try {
            this.config = this.parseConfigFromEnv(process?.env);
        } catch (error) {
            console.error(error, '============ lofusingDotEnv Function CacheConfigService =============');
        }
    }

    private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
        try {
            return {
                env: env?.NODE_ENV || DEFAULT__CACHE_CONFIG?.env,

                db: this.parseCacheConfigFromEnv(env) || DEFAULT__CACHE_CONFIG?.db,
            };
        } catch (error) {
            console.error(error, '============ parseConfigFromEnv Function CacheConfigService =============');
        }
    }

    private parseCacheConfigFromEnv(env: NodeJS.ProcessEnv): ConfigCacheData {
        try {
            return {
                cacheType: SYSTEM_CONSTANT.CACHE_TYPE || DEFAULT__CACHE_CONFIG?.db?.cacheType,
                cacheNode1: env?.CACHE_CLUSTER_NODE1_HOST || DEFAULT__CACHE_CONFIG?.db?.cacheNode1,
                cacheNode2: env?.CACHE_CLUSTER_NODE2_HOST || DEFAULT__CACHE_CONFIG?.db?.cacheNode2,
                cacheNode3: env?.CACHE_CLUSTER_NODE3_HOST || DEFAULT__CACHE_CONFIG?.db?.cacheNode3,
                cacheNodePort1: parseInt(env?.CACHE_CLUSTER_NODE1_PORT) || DEFAULT__CACHE_CONFIG?.db?.cacheNodePort1,
                cacheNodePort2: parseInt(env?.CACHE_CLUSTER_NODE2_PORT) || DEFAULT__CACHE_CONFIG?.db?.cacheNodePort2,
                cacheNodePort3: parseInt(env?.CACHE_CLUSTER_NODE3_PORT) || DEFAULT__CACHE_CONFIG?.db?.cacheNodePort3,
                cachePassword: env?.CACHE_PASSWORD || DEFAULT__CACHE_CONFIG?.db?.cachePassword,
                cacheCloseClient: SYSTEM_CONSTANT.CACHE_CLOSE_CLIENT || DEFAULT__CACHE_CONFIG?.db?.cacheCloseClient,
                cacheReadyLog: SYSTEM_CONSTANT.CACHE_READY_LOG || DEFAULT__CACHE_CONFIG?.db?.cacheReadyLog,
                cacheErrorLog: SYSTEM_CONSTANT.CACHE_ERROR_LOG || DEFAULT__CACHE_CONFIG?.db?.cacheErrorLog,
                cacheTTL: SYSTEM_CONSTANT.CACHE_TTL || DEFAULT__CACHE_CONFIG?.db?.cacheTTL,
                cacheEnableAutoPipelining: SYSTEM_CONSTANT.CACHE_ENABLE_AUTO_PIPELINING || DEFAULT__CACHE_CONFIG?.db?.cacheEnableAutoPipelining,
                cacheEnableOfflineQueue: SYSTEM_CONSTANT.CACHE_ENABLE_OFFLINE_QUEUE || DEFAULT__CACHE_CONFIG?.db?.cacheEnableOfflineQueue,
                cacheReadyCheck: SYSTEM_CONSTANT.CACHE_READY_CHECK || DEFAULT__CACHE_CONFIG?.db?.cacheReadyCheck,
                cacheClusterScaleRead: SYSTEM_CONSTANT.CACHE_CLUSTER_SCALE_READ as NodeRole || DEFAULT__CACHE_CONFIG?.db?.cacheClusterScaleRead,
                ThrottlerLimit: +SYSTEM_CONSTANT.THROTTLER_LIMIT || DEFAULT__CACHE_CONFIG?.db?.ThrottlerLimit,
                ThrottlerTtl: +SYSTEM_CONSTANT.THROTTLER_TTL || DEFAULT__CACHE_CONFIG?.db?.ThrottlerTtl,
            };
        } catch (error) {
            console.error(error, '============ parseCacheConfigFromEnv Function CacheConfigService =============');
        }
    }

    public get(): Readonly<ConfigData> {
        try {
            return this.config;
        } catch (error) {
            console.error(error, '============ get Function CacheConfigService =============');
        }
    }
}
