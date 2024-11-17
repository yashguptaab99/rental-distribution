/* istanbul ignore file */
import { Injectable } from '@nestjs/common'
import { HealthCheckService, HealthCheckResult, MongooseHealthIndicator } from '@nestjs/terminus'

@Injectable()
export class HealthChecker {
	constructor(
		private readonly health: HealthCheckService,
		private readonly db: MongooseHealthIndicator
	) {}

	async check(): Promise<HealthCheckResult> {
		return this.health.check([() => this.db.pingCheck('mongodb', { timeout: 300 })])
	}
}
