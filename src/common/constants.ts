// Redis Constants

// export const ACTIVITY_CONSTANT = {
//   GET_GENDER: 'getGender',
//   GET_CURRENCY: 'getCurrency',
//   GET_DEVICE_TYPE: 'getDeviceType',
//   GET_SIGNUP_TYPE: 'getSignupType',
//   GET_PROFESSION_TYPE: 'getProfessionType',
//   SIGN_UP_OR_SIGN_IN_SDK: 'signUpOrSignInSDK',
//   GET_CONSUMER_PROFILE: 'getConsumerProfileSDK',
//   UPDATE_CONSUMER_PROFILE: 'updateConsumerProfileSDK',
// }

export const REDIS_DB_CACHE_CONSTANT = {
  SIGN_UP_OR_LOGIN: 'singUpOrLogin_',
  REDIS_CACHE_GENDER_KEY_PREFIX: 'cache_gender',
  REDIS_CACHE_CURRENCY_KEY_PREFIX: 'cache_currency',
  REDIS_CACHE_SIGNUP_TYPE_KEY_PREFIX: 'cache_signupType',
  REDIS_CACHE_DEVICE_TYPE_KEY_PREFIX: 'cache_deviceType',
  REDIS_ADD_CONSUMER_PROFILE_KEY_PREFIX: 'consumer_profile',
  REDIS_CACHE_PROFESSION_TYPE_KEY_PREFIX: 'cache_professionType',
  REDIS_GET_CONSUMER_PROFILE_DB_CACHE_KEY_PREFIX: 'get_consumer_profile_db_cache',
  REDIS_FETCH_CONSUMER_PROFILE_DB_CACHE_KEY_PREFIX: 'fetch_consumer_profile_db_cache',
  REDIS_QUERY_MILLISECONDS: 34560000,
}

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

export const KAFKA_CONSTANTS = {

  KAFKA_TOPIC: 'user_service_error',
  // KAFKA_TOPIC_GOAL_ERROR: 'goal_service_error',
  // KAFKA_TOPIC_EVENT_ERROR: `event_service_error`,
  // KAFKA_TOPIC_BUDGET_ERROR: 'budget_service_error',
  // KAFKA_TOPIC_SPENDING_ERROR: 'spending_service_error',
  // KAFKA_TOPIC_NOTIFICATION_ERROR: 'notification_service_error',

  // KAFKA_TOPIC_SETTING_USER_GOAL_IN_REDIS: 'setting_user_goal_in_redis',
  // KAFKA_TOPIC_SETTING_USER_EVENT_IN_REDIS: 'setting_user_event_in_redis',
  // KAFKA_TOPIC_SETTING_USER_BUDGET_IN_REDIS: 'setting_user_budget_in_redis',
  // KAFKA_TOPIC_SETTING_USER_ACCOUNT_IN_REDIS: 'setting_user_account_in_redis',
  // KAFKA_TOPIC_SETTING_USER_DEFAULT_ACCOUNT_IN_REDIS: 'setting_user_default_account_in_redis',

  // KAFKA_DELETE_GOAL_TOPIC: 'delete_goal',
  // KAFKA_TOPIC_CREATE_VOUCHER: 'create_voucher',
  // KAFKA_CREATE_NOTIFICATION_TOPIC: 'create_notification',
  // KAFKA_TOPIC_ON_GOAL_VOUCHER_UPDATE:'goalVoucherUpdate',
  // KAFKA_TOPIC_CREATE_GOAL_TRANSFER: 'create_goal_transfer',
  // KAFKA_TOPIC_UPDATE_ON_VOUCHER:'update_budget_on_voucher',
  // KAFKA_TOPIC_GET_GOAL_BY_CONSUMER_ID: 'get_goal_by_consumer_id',
  // KAFKA_TOPIC_SAVING_AUTO_CRON_REMINDER: 'saving_auto_cron_reminder',
  // KAFKA_TOPIC_GET_CONSUMER_GOAL_ID_ARRAY: 'get_consumer_goal_id_array',
  // KAFKA_TOPIC_UPDATE_BUDGET_NOTIFICATION: 'update_budget_notification',
  // KAFKA_TOPIC_UPDATE_GOAL_ON_VOUCHER_DELETE: 'update_goal_on_voucher_delete',
  // KAFKA_TOPIC_MARKED_AS_ACHIEVED_GOAL_AMOUNT: 'marked_as_achieved_goal_amount',
  // KAFKA_TOPIC_UPDATE_SET_A_SIDE_ON_GOAL_DELETE:'update_set_a_side_on_goal_delete',
  // KAFKA_TOPIC_GOAL_PROGRESS_NOTIFICATION_STATUS: 'goal_progress_notification_status',
  // KAFKA_TOPIC_ADD_TRANSACTION_AMOUNT_IN_GOAL_CONSUMER: 'add_transaction_amount_in_goal_consumer',
  // KAFKA_TOPIC_UPDATE_BUDGET_ON_VOUCHER_CREATION_EVENT: 'update_budget_on_voucher_creation_event',
  // KAFKA_TOPIC_CREATE_GOAL_MARKED_AS_ACIEVED_VOUCHER: 'create_goal_marke_as_acieved_voucher_consumer',

  // KAFKA_TOPIC_REPLY_GET_GOAL_ID: 'get_consumer_goal_id_array.reply',
  // KAFKA_TOPIC_REPLY_GET_GOAL_BY_CONSUMER_ID: 'get_goal_by_consumer_id.reply',
}

