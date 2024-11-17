import { Module } from '@nestjs/common'

import { AgendaProvider } from '@rental-distribution/config/agenda/agenda.provider'

@Module({
	providers: [AgendaProvider],
	exports: [AgendaProvider],
})
export class AgendaModule {}
