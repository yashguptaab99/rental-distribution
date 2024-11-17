import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { kafkaConfig } from '@rental-distribution/config/kafka/kafka.config'

@Module({
	imports: [ClientsModule.register([kafkaConfig])],
	exports: [ClientsModule],
})
export class KafkaModule {}
