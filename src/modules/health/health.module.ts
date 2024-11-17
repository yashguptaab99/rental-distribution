import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { HealthCheckController } from '@rental-distribution/modules/health/health.controller'
import { HealthChecker } from '@rental-distribution/modules/health/service/health.service'

@Module({
	imports: [TerminusModule],
	providers: [HealthChecker],
	controllers: [HealthCheckController],
})
export class HealthCheckModule {}
