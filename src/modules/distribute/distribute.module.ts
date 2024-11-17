import { Module } from '@nestjs/common'

import { KafkaModule } from '@rental-distribution/core/kafka/kafka.module'

import { DistributeController } from '@rental-distribution/modules/distribute/distribute.controller'
import { DistributeListener } from '@rental-distribution/modules/distribute/listeners'
import { DistributeService } from '@rental-distribution/modules/distribute/service'

@Module({
	imports: [KafkaModule],
	controllers: [DistributeController, DistributeListener],
	providers: [DistributeService],
})
export class DistributeModule {}
