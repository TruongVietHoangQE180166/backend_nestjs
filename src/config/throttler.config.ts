import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig: ThrottlerModuleOptions = [
  {
    ttl: 60000, // 1 minute
    limit: 100, // limit each IP to 100 requests per ttl
  },
];
