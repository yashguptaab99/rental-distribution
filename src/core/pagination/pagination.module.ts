import { Global, Module } from '@nestjs/common'

import { PaginationHelper } from '@rental-distribution/core/pagination'

@Global()
@Module({
	providers: [PaginationHelper],
	exports: [PaginationHelper],
})
export class PaginationModule {}
