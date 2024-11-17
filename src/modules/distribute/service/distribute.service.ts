import { BadRequestException, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

import { FREQUENCY_ENUM, ICreateTask, ICreateTaskResponse } from '@rental-distribution/interfaces/distribute.types'

@Injectable()
export class DistributeService implements OnModuleInit {
	private readonly logger = new Logger(DistributeService.name)

	constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

	async onModuleInit() {
		await this.kafkaClient.connect()
	}

	async createTasks(data: ICreateTask): Promise<ICreateTaskResponse> {
		const { startTime, endTime, frequency, executionDate } = data

		// Validate times
		const start = new Date(startTime)
		const end = new Date(endTime)

		if (start >= end) throw new BadRequestException('startTime must be before endTime')

		// Calculate task execution timestamps
		const taskTimestamps = this.calculateTaskTimestamps(
			start,
			end,
			frequency,
			executionDate ? new Date(executionDate) : undefined
		)

		// Produce Kafka messages for each task
		for (const timestamp of taskTimestamps) {
			const payload = {
				timestamp,
				details: {
					startTime,
					endTime,
					frequency,
					executionDate,
				},
			}
			this.kafkaClient.emit('task-topic', payload)
			this.logger.log(`Scheduled task at ${new Date(timestamp).toISOString()}`)
		}

		return { message: 'Tasks scheduled successfully', taskTimestamps }
	}

	calculateTaskTimestamps(start: Date, end: Date, frequency: string, executionDate?: Date): number[] {
		const timestamps: number[] = []

		if (executionDate) {
			if (executionDate < start || executionDate > end)
				throw new BadRequestException('executionDate must be between startTime and endTime')
			timestamps.push(executionDate.getTime())
			return timestamps
		}

		const current = new Date(start)

		while (current <= end) {
			timestamps.push(current.getTime())

			switch (frequency.toLowerCase()) {
				case FREQUENCY_ENUM.DAILY:
					current.setDate(current.getDate() + 1)
					break
				case FREQUENCY_ENUM.WEEKLY:
					current.setDate(current.getDate() + 7)
					break
				case FREQUENCY_ENUM.MONTHLY:
					current.setMonth(current.getMonth() + 1)
					break
				default:
					throw new BadRequestException('Invalid frequency')
			}
		}

		return timestamps
	}
}