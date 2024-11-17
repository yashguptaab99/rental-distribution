import { ValidationPipe, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { I18nService, i18nValidationErrorFactory, I18nValidationExceptionFilter } from 'nestjs-i18n'
import { useContainer } from 'class-validator'

import { TranslationModule } from '@task-manager/resources/i18n'
import { PaginationModule } from '@task-manager/core/pagination'
import { DatabaseModule, DatabaseService } from '@task-manager/config/database'
import { ValidatorRulesModule } from '@task-manager/core/validator-rules'
import { EnvironmentService } from '@task-manager/config/env/environment'
import { SwaggerConfig } from '@task-manager/config'
import { QueryParserMiddleware } from '@task-manager/core/middlewares'
import { AllExceptionsFilter } from '@task-manager/core/filters'

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
