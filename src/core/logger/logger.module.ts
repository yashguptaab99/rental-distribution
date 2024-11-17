import { Global, Module } from '@nestjs/common'

import { LoggerService } from '@rental-distribution/core/logger/logger'

@Global()
@Module({
	providers: [LoggerService],
	exports: [LoggerService],
})
export class CustomLoggerModule {}
