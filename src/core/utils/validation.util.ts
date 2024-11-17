import { BadRequestException } from '@nestjs/common'
import { isMongoId } from 'class-validator'
import { I18nService } from 'nestjs-i18n'

export const validateIds = (
	params: Record<string, string | undefined>,
	i18n: I18nService,
	excluded: string[] = [],
	objectName = 'params'
) => {
	const errors = Object.entries(params).reduce((acc, [property, value]) => {
		if (value && !excluded.includes(property) && !isMongoId(value)) {
			return acc.concat(i18n.t('validations.INVALID_MONGO_ID', { args: { property: `${objectName}.${property}` } }))
		}
		return acc
	}, [])
	if (errors.length) throw new BadRequestException(errors)
}
