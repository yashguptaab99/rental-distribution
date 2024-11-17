import { Injectable } from '@nestjs/common'
import { isMongoId, ValidatorConstraintInterface } from 'class-validator'

import { IPartialService } from '@rental-distribution/core/base'

@Injectable()
export class ResourceNotFoundRule<T> implements ValidatorConstraintInterface {
	constructor(private service: IPartialService<T>) {}
	async validate(value: string) {
		if (!isMongoId(value)) return true
		await this.service.findById(value)
		return true
	}
}
