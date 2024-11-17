import { isMongoId, ValidatorConstraintInterface } from 'class-validator'
import { Injectable } from '@nestjs/common'

import { IPartialService } from '@task-manager/core/base'

@Injectable()
export class ResourceNotFoundRule<T> implements ValidatorConstraintInterface {
	constructor(private service: IPartialService<T>) {}
	async validate(value: string) {
		if (!isMongoId(value)) return true
		await this.service.findById(value)
		return true
	}
}
