import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller()
export class DistributeListener {
	private readonly logger = new Logger(DistributeListener.name)

	@MessagePattern('task-topic')
	handleTask(@Payload() message: any) {
		const payload = message.value ? JSON.parse(message.value.toString()) : message

		this.logger.log(`Received task: ${JSON.stringify(payload)}`)

		// Implement your task execution logic here
	}
}
