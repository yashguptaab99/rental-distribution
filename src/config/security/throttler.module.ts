import { Module } from '@nestjs/common'
import { ThrottlerModule, seconds } from '@nestjs/throttler'

@Module({
	imports: [
		ThrottlerModule.forRoot([
			{
				ttl: seconds(60),
				limit: 10,
			},
		]),
	],
})
export class ThrottlerConfigModule {}
