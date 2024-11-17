import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { I18nService } from 'nestjs-i18n'
import { Observable } from 'rxjs'

import { IPartialService } from '@rental-distribution/core/base'
import { HeaderResourceNotFoundError } from '@rental-distribution/core/exceptions'
import { validateIds } from '@rental-distribution/core/utils'

export class BaseVerifyInterceptor<T> implements NestInterceptor {
	constructor(
		private service: IPartialService<T>,
		private resource: {
			id: string
			name?: string
			excludes?: string[]
			source?: 'params' | 'headers'
			isHeaderRequired?: boolean
		},
		private i18n: I18nService
	) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<CallHandler>> {
		const request: FastifyRequest = context.switchToHttp().getRequest()
		const [{ params }] = context.getArgs()

		const { excludes, id, name, source, isHeaderRequired } = this.resource

		const resourceId = source === 'headers' ? (request.headers[id.toLowerCase()] as string) : params[id]
		if (!resourceId) {
			if (source === 'headers') if (isHeaderRequired) throw new HeaderResourceNotFoundError(this.i18n, id)
			return next.handle()
		}

		source === 'headers'
			? validateIds({ [id]: resourceId }, this.i18n, undefined, 'headers')
			: validateIds(params, this.i18n, excludes)

		const found = await this.service.findById(resourceId)

		name && (request[name] = found)

		return next.handle()
	}
}
