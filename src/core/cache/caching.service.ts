import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class CachingService {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	private static CONTROLLER_CACHE_PREFIX = 'controller'
	private static FUNCTION_CACHE_PREFIX = 'function'

	static createControllerCacheKey(url: string, userId?: string): string {
		return `${CachingService.CONTROLLER_CACHE_PREFIX}-${url}-${userId}`
	}

	static createFunctionCacheKey(className: string, functionName: string) {
		return `${CachingService.FUNCTION_CACHE_PREFIX}-${className}_${functionName}`
	}

	static createFunctionCallCacheKey(className: string, functionName: string, args: string) {
		const functionKey = this.createFunctionCacheKey(className, functionName)
		const cacheKey = `${functionKey}_${args}`
		return cacheKey
	}

	async clearControllerCache(urlPart: string, userId?: string) {
		const cachedKeys = await this.cacheManager.store.keys()
		const matchedKeys = cachedKeys.filter((key) => {
			const isUrlCacheKey = key.includes(CachingService.CONTROLLER_CACHE_PREFIX)
			const hasUrlPart = key.includes(urlPart)
			const isFromUser = userId ? key.includes(userId) : true

			return isUrlCacheKey && hasUrlPart && isFromUser
		})
		await this.cacheManager.store.mdel(...matchedKeys)
	}

	async clearFunctionCache(className: string, functionName: string, stringToMatchInParams: string) {
		const cachedKeys = await this.cacheManager.store.keys()
		const functionKey = CachingService.createFunctionCacheKey(className, functionName)
		const cachedKeysFromFunction = cachedKeys.filter((key) => key.includes(functionKey))

		const cachedKeysToDelete = cachedKeysFromFunction.filter((keyWithParams) =>
			keyWithParams.includes(stringToMatchInParams)
		)

		await this.cacheManager.store.mdel(...cachedKeysToDelete)
	}
}
