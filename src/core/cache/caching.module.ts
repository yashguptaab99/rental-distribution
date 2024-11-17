import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'

import { CachingService } from '@task-manager/core/cache/caching.service'

@Global()
@Module({
	imports: [
		CacheModule.register({
			ttl: 10000, // milliseconds
			max: 50, // maximum number of items in cache
			isGlobal: true,
		}),
	],
	providers: [CachingService],
	exports: [CachingService],
})
export class CachingModule {}
