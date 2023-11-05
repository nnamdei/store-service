import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config/config.service';
import * as dotenv from 'dotenv';
dotenv.config();
@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: () => new ConfigService(process.env),
    },
    // ConfigService,
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
