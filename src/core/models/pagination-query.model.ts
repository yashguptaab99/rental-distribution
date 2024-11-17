import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'

import { MESSAGES } from '@rental-distribution/resources/i18n'

import { IPaginationQuery } from '@rental-distribution/interfaces/pagination.types'

export class PaginationQuery implements IPaginationQuery {
	@IsOptional()
	@IsNumber({}, MESSAGES.INVALID_NUM)
	@Min(1, MESSAGES.MIN_NUMBER)
	@Type(() => Number)
	@ApiProperty({ type: () => Number, example: 10, required: false })
	limit?: number

	@IsOptional()
	@IsNumber({}, MESSAGES.INVALID_NUM)
	@Min(1, MESSAGES.MIN_NUMBER)
	@Type(() => Number)
	@ApiProperty({ type: () => Number, example: 1, required: false })
	page?: number
}
