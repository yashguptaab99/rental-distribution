import { BadRequestException, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import Agenda from 'agenda'

import {
	FREQUENCY_ENUM,
	ICreateDistribution,
	ICreateDistributionResponse,
} from '@rental-distribution/interfaces/distribute.types'
import { TaskService } from '@rental-distribution/modules/task/service'

@Injectable()
export class DistributeService implements OnModuleInit {
	private readonly logger = new Logger(DistributeService.name)

	constructor(
		@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
		@Inject('AGENDA_INSTANCE') private readonly agenda: Agenda,
		private readonly taskService: TaskService
	) {}

	async onModuleInit() {
		await this.kafkaClient.connect()
		this.defineAgendaJob()
	}

	defineAgendaJob() {
		this.agenda.define('Distribution Task', async (job) => {
			const { data } = job.attrs

			this.kafkaClient.emit('task-topic', data)
			this.logger.debug(`Emitted task at ${new Date(data.timestamp).toISOString()}`)

			// Update task status in the database (optional)
			await this.taskService.update(data.taskId, { isEmitted: true })
		})
	}

	async createTasks(data: ICreateDistribution): Promise<ICreateDistributionResponse> {
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

			const task = await this.taskService.create({ ...payload, isEmitted: false })

			await this.agenda.schedule(new Date(timestamp), 'Distribution Task', {
				timestamp,
				details: payload,
				taskId: task._id,
			})

			this.logger.debug(`Scheduled task at ${new Date(timestamp).toISOString()}`)
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
