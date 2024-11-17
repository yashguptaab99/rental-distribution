import { EnvironmentService } from '@rental-distribution/config/env/environment'

import FastifyServerApplication from '@rental-distribution/fastify-server'
import { AppModule } from '@rental-distribution/modules/app.module'

async function bootstrap() {
	const server = new FastifyServerApplication(new EnvironmentService())
	await server.run(AppModule)
}
bootstrap()
