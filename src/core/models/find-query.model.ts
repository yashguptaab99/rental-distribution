import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

import { IFilter, IFindQuery } from '@task-manager/interfaces/query.types'

import { PaginationQuery } from './pagination-query.model'

export class FindQuery<T> extends PaginationQuery implements IFindQuery<T> {
	@IsOptional()
	@ApiProperty({ type: () => String, example: 'createdAt.desc', required: false })
	sort?: Partial<Record<keyof T, 1 | -1>>

	@ApiProperty({ type: 'object', example: { key: 'value' }, required: false })
	@IsOptional()
	filter?: IFilter<T>
}
