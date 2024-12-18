import { Module } from '@nestjs/common'

import { AgendaModule, KafkaModule } from '@rental-distribution/config'

import { DistributeController } from '@rental-distribution/modules/distribute/distribute.controller'
import { DistributeListener } from '@rental-distribution/modules/distribute/listeners'
import { DistributeService } from '@rental-distribution/modules/distribute/service'
import { TaskModule } from '@rental-distribution/modules/task/task.module'

@Module({
	imports: [KafkaModule, TaskModule, AgendaModule],
	controllers: [DistributeController, DistributeListener],
	providers: [DistributeService],
})
export class DistributeModule {}
