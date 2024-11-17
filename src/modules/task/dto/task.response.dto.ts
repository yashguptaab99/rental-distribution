import { ApiResponseProperty } from '@nestjs/swagger'

import { BaseDTO } from '@rental-distribution/core/models'
import { enumString } from '@rental-distribution/core/utils'

import { ITask, ITaskStatus, TaskStatusEnum } from '@rental-distribution/interfaces/task.types'

export class TaskStatusDTO implements ITaskStatus {
	@ApiResponseProperty({ type: () => String, example: enumString(TaskStatusEnum) })
	id: TaskStatusEnum

	@ApiResponseProperty({ type: () => Date, example: '2022-08-01T14:09:36.071+00:00' })
	timestamp: Date
}

export class TaskResponseDTO extends BaseDTO implements ITask {
	@ApiResponseProperty({ example: 'Task', type: () => String })
	name: string

	@ApiResponseProperty({ example: 'Task Description', type: () => String })
	description?: string

	@ApiResponseProperty({ type: () => Date, example: '2022-08-01T14:09:36.071+00:00' })
	dueDate: Date

	@ApiResponseProperty({ type: () => TaskStatusDTO })
	readonly status: TaskStatusDTO
}
