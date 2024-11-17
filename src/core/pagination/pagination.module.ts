import { Global, Module } from '@nestjs/common'

import { PaginationHelper } from '@task-manager/core/pagination'

@Global()
@Module({
	providers: [PaginationHelper],
	exports: [PaginationHelper],
})
export class PaginationModule {}
