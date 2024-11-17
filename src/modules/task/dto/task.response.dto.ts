import { ApiResponseProperty } from '@nestjs/swagger'

import { BaseDTO, OwnerDTO } from '@task-manager/core/models'
import { enumString } from '@task-manager/core/utils'

import { IOwner } from '@task-manager/interfaces/base.types'
import { ITask, ITaskStatus, TaskStatusEnum } from '@task-manager/interfaces/task.types'

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
