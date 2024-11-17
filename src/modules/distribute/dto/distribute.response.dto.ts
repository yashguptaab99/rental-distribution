import { ApiResponseProperty } from '@nestjs/swagger'

import { ICreateTaskResponse } from '@rental-distribution/interfaces/distribute.types'

export class CreateTaskResponseDTO implements ICreateTaskResponse {
	@ApiResponseProperty({ type: () => Date, example: '2022-08-01T14:09:36.071+00:00' })
	message: string

	@ApiResponseProperty({ type: () => Date, example: '2022-08-01T14:09:36.071+00:00' })
	taskTimestamps: number[]
}
