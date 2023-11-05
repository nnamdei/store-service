import { Injectable } from '@nestjs/common';
import { ApplicationMode } from 'src/config/enums/application-mode.enum';

@Injectable()
export class ConfigService {
  constructor(private readonly env: Record<string, string> = process.env) {}

  getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];

    if (!value && throwOnMissing) {
      throw new Error(`Environment variable "${key}" missing`);
    }

    return value;
  }

  isProduction() {
    const mode: ApplicationMode = this.getValue(
      'APPLICATION_MODE',
    ) as ApplicationMode;

    if (!(mode in ApplicationMode)) {
      throw new Error(`Invalid application mode "${mode}"`);
    }

    return mode === ApplicationMode.PRODUCTION;
  }
}
