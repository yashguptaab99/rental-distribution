import { ClientProviderOptions, Transport } from '@nestjs/microservices'

export const kafkaConfig: ClientProviderOptions = {
	name: 'KAFKA_SERVICE',
	transport: Transport.KAFKA,
	options: {
		client: {
			clientId: 'be-service-client',
			brokers: ['localhost:9092'],
		},
		consumer: {
			groupId: 'be-service-consumer',
		},
	},
}
