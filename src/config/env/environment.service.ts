import { Injectable } from '@nestjs/common'

import { env, Environment } from './environment'

@Injectable()
export class EnvironmentService {
	get variables(): Environment {
		return env
	}
}
