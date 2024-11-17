import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { env } from '@task-manager/config/env/environment'

import { DatabaseService } from './database.service'

const { MONGO_DB_URI, MONGO_DB_URI_E2E_TEST, NODE_ENV } = env

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: () => ({
				uri: NODE_ENV === 'test' ? MONGO_DB_URI_E2E_TEST : MONGO_DB_URI,
			}),
		}),
	],
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DatabaseModule {}
