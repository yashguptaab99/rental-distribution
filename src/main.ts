import { EnvironmentService } from '@task-manager/config/env/environment'

import { AppModule } from '@task-manager/modules/app.module'
import FastifyServerApplication from '@task-manager/fastify-server'

async function bootstrap() {
	const server = new FastifyServerApplication(new EnvironmentService())
	await server.run(AppModule)
}
bootstrap()
