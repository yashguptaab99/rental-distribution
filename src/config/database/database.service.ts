import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'

export class DatabaseService {
	constructor(@InjectConnection() private readonly connection: Connection) {}

	getConnection(): Connection {
		return this.connection
	}
}
