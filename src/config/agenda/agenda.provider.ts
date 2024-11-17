import { Provider } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/mongoose'
import { Agenda } from 'agenda'

import { env } from '@rental-distribution/config/env/environment'

const { MONGO_DB_URI, MONGO_DB_URI_E2E_TEST, NODE_ENV } = env

export const AgendaProvider: Provider = {
	provide: 'AGENDA_INSTANCE',
	useFactory: async () => {
		const agenda = new Agenda({
			db: { address: NODE_ENV === 'test' ? MONGO_DB_URI_E2E_TEST : MONGO_DB_URI, collection: 'agendaJobs' },
			processEvery: '30 seconds',
		})

		await agenda.start()
		return agenda
	},
	inject: [getConnectionToken()],
}
