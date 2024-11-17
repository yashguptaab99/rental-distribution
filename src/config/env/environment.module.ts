import { DynamicModule, Module } from '@nestjs/common'

import { EnvironmentService } from './environment.service'

@Module({})
export class EnvironmentModule {
	static forRoot(): DynamicModule {
		return {
			module: EnvironmentModule,
			global: true,
			providers: [EnvironmentService],
			exports: [EnvironmentService],
		}
	}
}
