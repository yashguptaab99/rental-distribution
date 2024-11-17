import * as dotenv from 'dotenv'
import { cleanEnv, num, port, str, url } from 'envalid'

dotenv.config()

export const env = cleanEnv(process.env, {
	/**
	 * NODE CONFIGS
	 */
	NODE_ENV: str({
		desc: 'The current stage of this application',
		example: 'development',
	}),
	ENVIRONMENT: str({
		desc: 'The current environment of this application',
		example: 'local',
		default: 'local',
	}),
	PORT: port({
		default: 5000,
		desc: 'The TCP port that this server will listen to.',
		example: '9229',
	}),
	MAX_TIMEOUT: num({
		desc: 'Maximum timeout allowed in a API request, in milliseconds',
		example: '50',
		default: 0, // 10 minutes
	}),
	/**
	 * DATABASE CONFIGS
	 */
	MONGO_DB_URI: url({
		desc: 'Full URL to connect to database server.',
		example: 'mongodb://localhost:27017/rental-distribution',
	}),
	MONGO_DB_URI_E2E_TEST: url({
		desc: 'Full URL to connect to database server for e2e testing purpose.',
		example: 'mongodb://localhost:27017/rental-distribution-test',
	}),
})

export type Environment = typeof env
export { EnvironmentService } from './environment.service'
