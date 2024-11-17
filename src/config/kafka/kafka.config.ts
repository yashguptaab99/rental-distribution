import { ClientProviderOptions, Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'

export const kafkaConfig: ClientProviderOptions = {
	name: 'KAFKA_SERVICE',
	transport: Transport.KAFKA,
	options: {
		client: {
			clientId: 'be-service-client',
			brokers: ['localhost:19092'],
		},
		consumer: {
			groupId: 'be-service-consumer',
		},
		producer: {
			createPartitioner: Partitioners.LegacyPartitioner,
		},
	},
}
