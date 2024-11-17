import { NestFastifyApplication } from '@nestjs/platform-fastify'
import compression from '@fastify/compress'

type CompressionType = 'brotli' | 'gzip'

/**
 * By default, fastify-compress will use Brotli compression (on Node >= 11.7.0) when browsers
 * indicate support for the encoding
 * @see {@link https://docs.nestjs.com/techniques/compression} for further information.
 */
export class CompressionConfig {
	static async useCompression(app: NestFastifyApplication, type: CompressionType = 'gzip') {
		if (type === 'brotli') await app.register(compression)
		else if (type === 'gzip') await app.register(compression, { encodings: ['gzip', 'deflate'] })
	}
}
