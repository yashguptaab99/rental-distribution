import { ApiResponseProperty } from '@nestjs/swagger'

import { BaseDTO } from '@rental-distribution/core/models'

import { ITask } from '@rental-distribution/interfaces/task.types'

export class TaskResponseDTO extends BaseDTO implements ITask {
	@ApiResponseProperty({ example: 'Task', type: () => Number })
	timestamp: number

	@ApiResponseProperty({ example: {}, type: () => Object })
	details: any

	@ApiResponseProperty({ example: true, type: () => Boolean })
	isEmitted: boolean
}
