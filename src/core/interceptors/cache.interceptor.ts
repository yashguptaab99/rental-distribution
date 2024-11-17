import { CacheInterceptor } from '@nestjs/cache-manager'
import { ExecutionContext, Injectable } from '@nestjs/common'

import { CachingService } from '@rental-distribution/core/cache'
import { NO_CACHE_KEY } from '@rental-distribution/core/decorators'

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
	trackBy(context: ExecutionContext): string | undefined {
		const request = context.switchToHttp().getRequest()

		const isAllowedToCache = this.allowedMethods.includes(request.method)

		const ignoreCaching: boolean = this.reflector.get(NO_CACHE_KEY, context.getHandler())

		if (!isAllowedToCache || ignoreCaching) return undefined

		return CachingService.createControllerCacheKey(request.url, request.user?.sub)
	}
}
