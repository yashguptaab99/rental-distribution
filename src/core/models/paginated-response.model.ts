import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'

import {
	IPaginatedResponse,
	IPaginationMeta,
	IPaginationMetaItem,
	IPaginationMetaPage,
} from '@task-manager/interfaces/pagination.types'

class PaginationMetaItemDTO implements IPaginationMetaItem {
	@ApiResponseProperty({ type: () => Number, example: 100 })
	totalItems?: number

	@ApiResponseProperty({ type: () => Number, example: 20 })
	limit: number

	@ApiResponseProperty({ type: () => Number, example: 1 })
	begins: number

	@ApiResponseProperty({ type: () => Number, example: 10 })
	ends: number
}

class PaginationMetaPageDTO implements IPaginationMetaPage {
	@ApiResponseProperty({ type: () => Number, example: 2 })
	current: number

	@ApiResponseProperty({ type: () => Number, example: 1 })
	previous: number | null

	@ApiResponseProperty({ type: () => Number, example: 3 })
	next: number | null

	@ApiResponseProperty({ type: () => Number, example: 10 })
	total: number

	@ApiResponseProperty({ type: () => Number, example: 10 })
	size: number
}

export class MetaDataDto implements IPaginationMeta {
	@ApiResponseProperty({ type: () => PaginationMetaItemDTO })
	items: PaginationMetaItemDTO

	@ApiResponseProperty({ type: () => PaginationMetaPageDTO })
	page: PaginationMetaPageDTO
}

export class PaginatedResponse<T> implements IPaginatedResponse<T> {
	data: T[]
	meta: MetaDataDto
}

export function GetPaginationDto<T>(MyClass: T): any {
	class PaginatedResponseDTO<T> implements IPaginatedResponse<T> {
		@ApiProperty({ type: () => [MyClass] })
		data: T[]

		@ApiProperty({ type: () => MetaDataDto })
		meta: MetaDataDto
	}
	return PaginatedResponseDTO
}
