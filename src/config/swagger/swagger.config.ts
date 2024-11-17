import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

/**
 * The OpenAPI specification is a language-agnostic definition format used to describe RESTful APIs. Nest provides a
 * dedicated module which allows generating such a specification by leveraging decorators.
 * @see {@link https://docs.nestjs.com/openapi/introduction} for further information.
 */
export class SwaggerConfig {
	static useSwagger(app: INestApplication) {
		const config = new DocumentBuilder().setTitle('TaskManager-API').setVersion('0.0.1').addBearerAuth().build()
		const document = SwaggerModule.createDocument(app, config)

		SwaggerModule.setup('docs', app, document)
	}
}
