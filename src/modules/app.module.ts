import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino/LoggerModule'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { DatabaseModule } from '@task-manager/config/database'
import { EnvironmentModule, ThrottlerConfigModule } from '@task-manager/config'
import { pinoLoggerConfig } from '@task-manager/config/logging/pino.config'
import { CustomLoggerModule } from '@task-manager/core/logger'
import { HttpCacheInterceptor } from '@task-manager/core/interceptors/cache.interceptor'
import { CachingModule } from '@task-manager/core/cache'
import { TranslationModule } from '@task-manager/resources/i18n'
import { QueryParserMiddleware } from '@task-manager/core/middlewares'
import { PaginationModule } from '@task-manager/core/pagination'
import { ValidatorRulesModule } from '@task-manager/core/validator-rules'

import { HealthCheckModule } from '@task-manager/modules/health/health.module'
import { TaskModule } from '@task-manager/modules/task/task.module'

const API_MODULES = [HealthCheckModule, TaskModule]

// TODO: Add new root api routes
const APIs = ['tasks']
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TranslationModule.forRoot(),
		ThrottlerConfigModule,
		DatabaseModule,
		LoggerModule.forRoot(pinoLoggerConfig),
		EnvironmentModule.forRoot(),
		PaginationModule,
		CachingModule,
		ValidatorRulesModule,
		CustomLoggerModule,
		...API_MODULES,
	],
	controllers: [],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: HttpCacheInterceptor,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(QueryParserMiddleware)
			.forRoutes(
				...APIs.map((path) => ({ path, method: RequestMethod.GET })),
				...APIs.map((path) => ({ path: `${path}/:id/(.*)s`, method: RequestMethod.GET }))
			)
	}
}
