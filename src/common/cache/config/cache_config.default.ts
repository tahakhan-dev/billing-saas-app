import { SYSTEM_CONSTANT } from 'src/common/constants';
import { ConfigData } from './cache_config.interface';
import 'dotenv/config';


const cache_type = SYSTEM_CONSTANT.CACHE_TYPE;

const node1_host = process?.env?.CACHE_CLUSTER_NODE1_HOST;
const node2_host = process?.env?.CACHE_CLUSTER_NODE2_HOST;
const node3_host = process?.env?.CACHE_CLUSTER_NODE3_HOST;

const node1_port = +process?.env?.CACHE_CLUSTER_NODE1_PORT;
const node2_port = +process?.env?.CACHE_CLUSTER_NODE2_PORT;
const node3_port = +process?.env?.CACHE_CLUSTER_NODE3_PORT;

const cache_close_client = SYSTEM_CONSTANT.CACHE_CLOSE_CLIENT;
const cache_ready_log = SYSTEM_CONSTANT.CACHE_READY_LOG;
const cache_error_log = SYSTEM_CONSTANT.CACHE_ERROR_LOG;

const cache_enable_auto_pipelining = SYSTEM_CONSTANT.CACHE_ENABLE_AUTO_PIPELINING;
const cache_enable_offline_queue = SYSTEM_CONSTANT.CACHE_ENABLE_OFFLINE_QUEUE;
const cache_ready_check = SYSTEM_CONSTANT.CACHE_READY_CHECK;
const cache_cluster_scale_read: NodeRole = SYSTEM_CONSTANT.CACHE_CLUSTER_SCALE_READ as NodeRole

const cache_password = process?.env.CACHE_PASSWORD
const cache_ttl = +SYSTEM_CONSTANT.CACHE_TTL
const throttler_ttl = +SYSTEM_CONSTANT.THROTTLER_TTL
const throttler_limit = +SYSTEM_CONSTANT.THROTTLER_LIMIT

export declare type NodeRole = "master" | "slave" | "all";


// Redis Configuration 

export const DEFAULT__CACHE_CONFIG: ConfigData = {
    env: 'cacheConfig',
    db: {
        cacheType: cache_type,
        cacheNode1: node1_host,
        cacheNode2: node2_host,
        cacheNode3: node3_host,
        cacheNodePort1: node1_port,
        cacheNodePort2: node2_port,
        cacheNodePort3: node3_port,
        cachePassword: cache_password,
        cacheCloseClient: cache_close_client,
        cacheReadyLog: cache_ready_log,
        cacheErrorLog: cache_error_log,
        cacheTTL: cache_ttl,
        cacheEnableAutoPipelining: cache_enable_auto_pipelining,
        cacheEnableOfflineQueue: cache_enable_offline_queue,
        cacheReadyCheck: cache_ready_check,
        cacheClusterScaleRead: cache_cluster_scale_read,
        ThrottlerTtl: throttler_ttl,
        ThrottlerLimit: throttler_limit,


    }
};


