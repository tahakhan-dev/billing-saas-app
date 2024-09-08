export const SYSTEM_CONSTANT = {
  THROTTLER_USER_TTL: 600,
  THROTTLER_USER_LIMIT: 1000,
  THROTTLER_TTL: 600,
  THROTTLER_LIMIT: 1000,
  CACHE_TTL: 345600,
  CACHE_CLOSE_CLIENT: true,
  CACHE_READY_LOG: true,
  CACHE_ERROR_LOG: true,
  CACHE_ENABLE_AUTO_PIPELINING: false,
  CACHE_ENABLE_OFFLINE_QUEUE: false,
  CACHE_READY_CHECK: true,
  CACHE_CLUSTER_SCALE_READ: 'slave',
  CACHE_TYPE: 'ioredis/cluster',
  GLOABAL_API_PREFIX: 'api/',
  APP_VERSION: '1',
}

export const jwtConstants = {
  secret: "secretKey", // Use a strong secret key in production
};

