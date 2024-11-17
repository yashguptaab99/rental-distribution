import { ValidationArguments } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export const MESSAGES = {
	NOT_EMPTY: { message: i18nValidationMessage('validations.NOT_EMPTY') },
	MAX_LENGTH: { message: i18nValidationMessage('validations.MAX_LENGTH') },
	MAX_LENGTH_NESTED: { message: i18nValidationMessage('validations.MAX_LENGTH_NESTED') },
	MIN_LENGTH: { message: i18nValidationMessage('validations.MIN_LENGTH') },
	ARRAY_MAX_LENGTH: { message: i18nValidationMessage('validations.ARRAY_MAX_LENGTH') },
	ARRAY_MIN_LENGTH: { message: i18nValidationMessage('validations.ARRAY_MIN_LENGTH') },
	ARRAY_NOT_EMPTY: { message: i18nValidationMessage('validations.ARRAY_NOT_EMPTY') },
	IS_DEFINED: { message: i18nValidationMessage('validations.IS_DEFINED') },
	INVALID_STRING: { message: i18nValidationMessage('validations.INVALID_STRING') },
	INVALID_STRING_PATTERN: (pattern: string) => ({
		message: i18nValidationMessage('validations.INVALID_STRING_PATTERN', { pattern }),
	}),
	INVALID_STRING_NESTED: { message: i18nValidationMessage('validations.INVALID_STRING_NESTED') },
	INVALID_HEX_COLOR: { message: i18nValidationMessage('validations.INVALID_HEX_COLOR') },
	INVALID_DATE: { message: i18nValidationMessage('validations.INVALID_DATE') },
	INVALID_SORTING: { message: i18nValidationMessage('validations.INVALID_SORTING') },
	INVALID_NUM: { message: i18nValidationMessage('validations.INVALID_NUM') },
	POSITIVE_NUM: { message: i18nValidationMessage('validations.POSITIVE_NUM') },
	MIN_NUMBER: { message: i18nValidationMessage('validations.MIN_NUMBER') },
	MAX_NUMBER: { message: i18nValidationMessage('validations.MAX_NUMBER') },
	INVALID_EMAIL: { message: i18nValidationMessage('validations.INVALID_EMAIL') },
	INVALID_MONGO_ID: { message: i18nValidationMessage('validations.INVALID_MONGO_ID') },
	INVALID_IDS: { message: i18nValidationMessage('validations.INVALID_IDS') },
	INVALID_BOOLEAN: { message: i18nValidationMessage('validations.INVALID_BOOLEAN') },
	INVALID_OBJECT: { message: i18nValidationMessage('validations.INVALID_OBJECT') },
	INVALID_ARRAY: { message: i18nValidationMessage('validations.INVALID_ARRAY') },
	INVALID_ENUM_LIST: { message: i18nValidationMessage('validations.INVALID_ENUM_LIST') },
	ARRAY_UNIQUE: { message: i18nValidationMessage('validations.ARRAY_UNIQUE') },
	UNIQUE_FIELDS: { message: i18nValidationMessage('validations.UNIQUE_FIELDS') },
	FAILED_NESTED_VALIDATION: { message: i18nValidationMessage('validations.FAILED_NESTED_VALIDATION') },
	INVALID_ENUM_VALUE: {
		message: (args: ValidationArguments) => {
			const { constraints } = args
			return i18nValidationMessage('validations.INVALID_ENUM_VALUE')({
				...args,
				value: Object.values(constraints[0]).join(', '),
			})
		},
	},
}
