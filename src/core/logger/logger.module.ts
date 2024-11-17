import { Module, Global } from '@nestjs/common'

import { LoggerService } from '@task-manager/core/logger/logger'

@Global()
@Module({
	providers: [LoggerService],
	exports: [LoggerService],
})
export class CustomLoggerModule {}
