import { Provider } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/mongoose'
import { Agenda } from 'agenda'
import { Connection } from 'mongoose'

export const AgendaProvider: Provider = {
	provide: 'AGENDA_INSTANCE',
	useFactory: async (connection: Connection) => {
		const agenda = new Agenda({
			mongo: connection.db as any,
			processEvery: '30 seconds',
		})

		await agenda.start()
		return agenda
	},
	inject: [getConnectionToken()],
}
