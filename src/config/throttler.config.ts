import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_CONSTANTS } from '../common/constants/app.constant';

export const throttlerConfig: ThrottlerModuleOptions = [
  {
    ttl: APP_CONSTANTS.THROTTLER.TTL, // 1 minute
    limit: APP_CONSTANTS.THROTTLER.LIMIT, // limit each IP to 100 requests per ttl
  },
];
