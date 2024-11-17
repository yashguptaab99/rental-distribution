import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggerModule } from 'nestjs-pino/LoggerModule'

import { EnvironmentModule, ThrottlerConfigModule } from '@rental-distribution/config'
import { DatabaseModule } from '@rental-distribution/config/database'
import { pinoLoggerConfig } from '@rental-distribution/config/logging/pino.config'
import { CachingModule } from '@rental-distribution/core/cache'
import { HttpCacheInterceptor } from '@rental-distribution/core/interceptors/cache.interceptor'
import { KafkaModule } from '@rental-distribution/core/kafka/kafka.module'
import { CustomLoggerModule } from '@rental-distribution/core/logger'
import { QueryParserMiddleware } from '@rental-distribution/core/middlewares'
import { PaginationModule } from '@rental-distribution/core/pagination'
import { ValidatorRulesModule } from '@rental-distribution/core/validator-rules'
import { TranslationModule } from '@rental-distribution/resources/i18n'

import { HealthCheckModule } from '@rental-distribution/modules/health/health.module'
import { TaskModule } from '@rental-distribution/modules/task/task.module'

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
		KafkaModule,
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
