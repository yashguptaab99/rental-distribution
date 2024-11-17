import fastifyHelmet from '@fastify/helmet'
import { NestFastifyApplication } from '@nestjs/platform-fastify'

/**
 * ----------------  Quick Guide ----------------
 *
 * Content Security Policy (CSP): Helps prevent various types of injection attacks by specifying which dynamic
 * resources are allowed to load.
 *
 * HTTP Strict Transport Security (HSTS): Enforces secure (HTTPS) connections to the server.
 *
 * XSS Filter: Activates built-in browser mechanisms to protect against cross-site scripting attacks.
 *
 * NoSniff: Prevents the browser from MIME-sniffing a response away from the declared content-type.
 *
 * Frameguard: Protects against click jacking attacks by preventing the page from being displayed in a frame or iframe.
 *
 * Referrer Policy: Controls the amount of information included in the referrer header to enhance privacy and security.
 *
 */

/**
 * Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
 * Generally, Helmet is just a collection of smaller middleware functions that set security-related HTTP headers
 * @param {NestFastifyApplication} app - The application server.
 * @see {@link https://docs.nestjs.com/security/helmet} for further information.
 */
export class HelmetConfig {
	static useHelmet(app: NestFastifyApplication) {
		app.register(fastifyHelmet, {
			// Sets the Cross-Origin-Resource-Policy header to prevent other domains from reading the content.
			// crossOriginResourcePolicy: { policy: 'same-origin' },
			crossOriginResourcePolicy: false, // Temporarily fix until app and api share same domain
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `'unsafe-eval'`],
					styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
					imgSrc: ["'self'", 'data:', 'https:'],
					connectSrc: ["'self'", 'https:'],
					fontSrc: ["'self'", 'https:', 'data:'],
					objectSrc: ["'none'"],
					upgradeInsecureRequests: [],
				},
			},
			noSniff: true,
			xssFilter: true,
			hsts: {
				maxAge: 63072000, // 2 years
				includeSubDomains: true,
				preload: true,
			},
			frameguard: {
				action: 'deny',
			},
		})
	}
}
