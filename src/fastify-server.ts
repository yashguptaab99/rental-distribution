/* eslint-disable no-console */
import { DynamicModule, Logger as NestLogger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Agenda } from 'agenda'
import * as Agendash from 'agendash'
import { useContainer } from 'class-validator'
import { i18nValidationErrorFactory, I18nValidationExceptionFilter } from 'nestjs-i18n'

import {
	CompressionConfig,
	CsrfProtectionConfig,
	HelmetConfig,
	kafkaConfig,
	SwaggerConfig,
} from '@rental-distribution/config'
import { EnvironmentService } from '@rental-distribution/config/env/environment'
import { AllExceptionsFilter } from '@rental-distribution/core/filters'

export default class FastifyServerApplication {
	public app: NestFastifyApplication

	constructor(private readonly env: EnvironmentService) {}

	protected async configureServices(appModule) {
		this.app.enableCors()
		this.app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				exceptionFactory: i18nValidationErrorFactory,
				transformOptions: { exposeUnsetFields: false },
			})
		)

		HelmetConfig.useHelmet(this.app)
		await CsrfProtectionConfig.useCsrf(this.app)
		await CompressionConfig.useCompression(this.app, 'brotli')
		SwaggerConfig.useSwagger(this.app)
		useContainer(this.app.select(appModule as DynamicModule), { fallbackOnErrors: true })

		this.app.connectMicroservice(kafkaConfig)
		await this.app.startAllMicroservices()
	}

	protected configureAdapters() {
		this.app.useGlobalFilters(
			new AllExceptionsFilter(new NestLogger(AllExceptionsFilter.name)),
			new I18nValidationExceptionFilter({ detailedErrors: false })
		)

		const agenda = this.app.get<Agenda>('AGENDA_INSTANCE')
		this.app.use('/dash', Agendash.default(agenda))

		this.app.enableShutdownHooks()
		process.on('SIGTERM', async () => {
			await agenda.stop()
			process.exit(0)
		})
	}

	public async run(appModule: unknown): Promise<void> {
		this.app = await NestFactory.create<NestFastifyApplication>(appModule, new FastifyAdapter(), {
			rawBody: true,
		})

		const { PORT, NODE_ENV, MAX_TIMEOUT } = this.env.variables

		await this.configureServices(appModule)
		this.configureAdapters()

		const server = await this.app.listen(PORT, '0.0.0.0')
		server.setTimeout(MAX_TIMEOUT)
		console.info(
			`⚛️ [${NODE_ENV.toUpperCase()}] rental-distribution API is running on: ${await this.app.getUrl()}. Max API timeout is ${MAX_TIMEOUT}ms`
		)
	}
}
