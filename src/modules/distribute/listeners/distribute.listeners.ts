import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { ICreateDistribution } from '@rental-distribution/interfaces/distribute.types'

export interface IMessage {
	timestamp: number
	details: ICreateDistribution
	taskId: string
}
@Controller()
export class DistributeListener {
	private readonly logger = new Logger(DistributeListener.name)

	@MessagePattern('task-topic')
	handleTask(@Payload() message) {
		const payload: IMessage = message.value ? JSON.parse(message.value.toString()) : message

		this.logger.debug(
			`Received task (ID: ${payload.taskId}): Rental Yield of ${payload.details.distributionAmount} tokens successfully distributed at ${new Date(payload.timestamp).toLocaleString()} [UTC: ${new Date(payload.timestamp).toISOString()}]`
		)

		// Implement your task execution logic here
	}
}
