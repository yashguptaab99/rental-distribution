import { Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'NoEmptyBody', async: false })
@Injectable()
export class NoEmptyBodyRule implements ValidatorConstraintInterface {
	constructor(private i18n: I18nService) {}

	validate(field: never, args: ValidationArguments) {
		const { object } = args
		return Object.entries(object).some(([key, value]) => {
			return !key.startsWith('_') && value !== undefined
		})
	}

	defaultMessage(args: ValidationArguments) {
		const [messageKey] = args.constraints || []
		return this.i18n.t(`validations.${messageKey || 'EMPTY_REQUEST_BODY'}`)
	}
}
