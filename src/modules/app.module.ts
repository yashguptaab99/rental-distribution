import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { AgendaModule, EnvironmentModule, KafkaModule, ThrottlerConfigModule } from '@rental-distribution/config'
import { DatabaseModule } from '@rental-distribution/config/database'
import { CachingModule } from '@rental-distribution/core/cache'
import { HttpCacheInterceptor } from '@rental-distribution/core/interceptors/cache.interceptor'
import { CustomLoggerModule } from '@rental-distribution/core/logger'
import { QueryParserMiddleware } from '@rental-distribution/core/middlewares'
import { PaginationModule } from '@rental-distribution/core/pagination'
import { ValidatorRulesModule } from '@rental-distribution/core/validator-rules'
import { TranslationModule } from '@rental-distribution/resources/i18n'

import { DistributeModule } from '@rental-distribution/modules/distribute/distribute.module'
import { HealthCheckModule } from '@rental-distribution/modules/health/health.module'
import { TaskModule } from '@rental-distribution/modules/task/task.module'

const API_MODULES = [HealthCheckModule, DistributeModule, TaskModule]

const APIs = ['tasks', 'distribute']
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TranslationModule.forRoot(),
		ThrottlerConfigModule,
		DatabaseModule,
		EnvironmentModule.forRoot(),
		PaginationModule,
		CachingModule,
		ValidatorRulesModule,
		CustomLoggerModule,
		KafkaModule,
		AgendaModule,
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
