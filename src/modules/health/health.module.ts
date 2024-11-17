import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { HealthChecker } from '@task-manager/modules/health/service/health.service'
import { HealthCheckController } from '@task-manager/modules/health/health.controller'

@Module({
	imports: [TerminusModule],
	providers: [HealthChecker],
	controllers: [HealthCheckController],
})
export class HealthCheckModule {}
