import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus'

import { HealthChecker } from '@rental-distribution/modules/health/service/health.service'

@ApiTags('Health Check')
@Controller('')
export class HealthCheckController {
	constructor(private healthCheck: HealthChecker) {}

	@ApiOperation({ summary: 'HealthCheck' })
	@ApiOkResponse({
		description: 'Health Check run correctly.',
	})
	@Get()
	@HealthCheck()
	check(): Promise<HealthCheckResult> {
		return this.healthCheck.check()
	}
}
