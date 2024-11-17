import { Injectable } from '@nestjs/common'
import { isMongoId, ValidationArguments, ValidatorConstraintInterface } from 'class-validator'
import { I18nService } from 'nestjs-i18n'

import { BaseRepository } from '@rental-distribution/core/base'

@Injectable()
export class VerifyIdsRule<T> implements ValidatorConstraintInterface {
	constructor(
		private repo: BaseRepository<T>,
		private i18n: I18nService
	) {}

	private errors: string[] = []

	async validate(ids: string[]) {
		if (!Array.isArray(ids)) return true
		await Promise.all(
			ids.map(async (id) => {
				if (!isMongoId(id)) return
				const found = await this.repo.findById(id)
				if (!found) this.errors.push(id)
			})
		)
		return !this.errors.length
	}

	defaultMessage(args: ValidationArguments) {
		const [resource] = args.constraints
		const errorString = this.errors.join(', ')
		const message = `${this.i18n.t('exceptions.RESOURCE.NOT_FOUND', { args: { resource } })}: (${errorString})`
		this.errors = []
		return message
	}
}
