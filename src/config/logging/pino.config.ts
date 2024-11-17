import { Params } from 'nestjs-pino'

export const pinoLoggerConfig: Params = {
	pinoHttp: {
		level: 'debug', // or info for production
		formatters: {
			level: (label) => ({ level: label }),
		},
		transport: {
			target: 'pino-pretty',
			options: {
				ignore: 'req.headers,res',
				levelFirst: true,
				translateTime: true,
				colorize: true,
			},
		},
	},
}
