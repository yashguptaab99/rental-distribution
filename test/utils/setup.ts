import { Logger, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { useContainer } from 'class-validator'
import { I18nService, i18nValidationErrorFactory, I18nValidationExceptionFilter } from 'nestjs-i18n'

import { SwaggerConfig } from '@rental-distribution/config'
import { DatabaseModule, DatabaseService } from '@rental-distribution/config/database'
import { EnvironmentService } from '@rental-distribution/config/env/environment'
import { AllExceptionsFilter } from '@rental-distribution/core/filters'
import { QueryParserMiddleware } from '@rental-distribution/core/middlewares'
import { PaginationModule } from '@rental-distribution/core/pagination'
import { ValidatorRulesModule } from '@rental-distribution/core/validator-rules'
import { TranslationModule } from '@rental-distribution/resources/i18n'

const logger = new Logger()
logger.error = jest.fn()

export async function setupFactory(MainModule: any, DependentModules: any[] = []) {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [
			MainModule,
			...DependentModules,
			TranslationModule.forRoot(),
			PaginationModule,
			DatabaseModule,
			ValidatorRulesModule,
		],
		providers: [EnvironmentService],
	}).compile()

	const db = moduleFixture.get<DatabaseService>(DatabaseService).getConnection()
	const i18n = moduleFixture.get<I18nService>(I18nService)
	const app = moduleFixture.createNestApplication()

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			exceptionFactory: i18nValidationErrorFactory,
			transformOptions: { exposeUnsetFields: false },
		})
	)
	SwaggerConfig.useSwagger(app)
	app.use(new QueryParserMiddleware(i18n).use)
	useContainer(app.select(MainModule), { fallbackOnErrors: true })
	app.useGlobalFilters(new AllExceptionsFilter(logger), new I18nValidationExceptionFilter({ detailedErrors: false }))
	await app.init()

	return { db, app, i18n }
}
