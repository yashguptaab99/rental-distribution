import { BaseExceptionFilter } from '@nestjs/core'
import { Catch, ArgumentsHost, HttpException, InternalServerErrorException, Logger } from '@nestjs/common'
import { FastifyReply } from 'fastify'

type ErrorObject = {
	statusCode: number
	error: string
	message: string
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
	constructor(private readonly logger: Logger) {
		super()
	}

	catch(exception: Error, host: ArgumentsHost): unknown {
		// Error logging
		this.logger.error(exception.message, exception.stack)
		// Goal:
		// I need to catch the UnhandledPromiseRejection or any other which are not nestjs exceptions
		// So, I am checking if the exceptions are instance of HttpException,
		// If true, then it means that it is a nestjs Exception
		// else, I am creating a Exception which I am sending to the client
		const res = host.switchToHttp().getResponse<FastifyReply>()

		// All nestjs exceptions are instanceof HttpException
		// So we can easily delegate those exception to nestjs
		if (exception instanceof HttpException) {
			const { statusCode, error, message } = exception.getResponse() as ErrorObject

			return res
				.status(statusCode || 500)
				.send({ message: error, errors: Array.isArray(message) ? message : [message] })
		}

		// IMPORTANT:
		// If its unknown exception i.e. UnhandledPromiseRejection or FirebaseAuthError
		const serverError = new InternalServerErrorException(exception.message)
		const { statusCode, error, message } = serverError.getResponse() as ErrorObject

		return res.status(statusCode || 500).send({ message: error, errors: [message] })
	}
}
