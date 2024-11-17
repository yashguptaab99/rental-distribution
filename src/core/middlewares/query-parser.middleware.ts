import { Injectable, NestMiddleware } from '@nestjs/common'
import { isBooleanString, isDateString, isMongoId, isNumberString } from 'class-validator'
import { ServerResponse } from 'http'
import { I18nService } from 'nestjs-i18n'
import { FastifyRequest } from 'fastify'

type SortQuery = { [key: string]: 'asc' | 'desc' }
const SORT_SYMBOLS = { asc: 1, desc: -1 }

@Injectable()
export class QueryParserMiddleware implements NestMiddleware {
	constructor(private readonly i18n: I18nService) {}
	use = (request: FastifyRequest, res: ServerResponse, next: () => void) => {
		const query = request['query'] as any
		const invalidQuery: string[] = []
		if (query?.sort && query?.sort !== '') {
			const sortQueries: SortQuery = query.sort.split(',').reduce((acc: SortQuery, item: string) => {
				const [field, sort] = item.split('.')
				if (SORT_SYMBOLS[sort]) {
					acc[field] = SORT_SYMBOLS[sort.toLowerCase()]
					return acc
				}
				invalidQuery.push(`sort: ${item}`)
			}, {})

			query.sort = sortQueries
		}
		const { page, limit, sort, ...filter } = query
		const { result, conditionErrors } = this.getFilter(filter)

		if (conditionErrors.length)
			return this.sendErrorResponse(res, this.i18n.t('validations.INVALID_CONDITIONS'), conditionErrors)

		if (invalidQuery.length)
			return this.sendErrorResponse(res, this.i18n.t('validations.INVALID_SORTING'), invalidQuery)

		query.filter = result
		next()
	}

	private conditions: Record<string, 1> = { gt: 1, gte: 1, lt: 1, lte: 1, like: 1 }

	private sendErrorResponse = (res: ServerResponse, messageKey: string, errors: string[]) => {
		res.writeHead(400, { 'Content-Type': 'Application/json' })
		res.write(Buffer.from(JSON.stringify({ message: this.i18n.t(messageKey), errors })))
		res.end()
	}

	private equalityValue = (value: string) => {
		if (isMongoId(value)) return { $eq: value }

		const date = value.replace(' ', '+')
		if (isDateString(date)) return { $eq: new Date(date) }

		if (isNumberString(value)) return { $eq: +value }
		if (isBooleanString(value)) return { $eq: value === 'true' }

		const values = value.split(',')
		return values.length === 1 ? { $regex: value, $options: 'i' } : { $regex: values.join('|'), $options: 'i' }
	}

	private conditionalValue = (value: string) => {
		const date = value.replace(' ', '+')
		if (isDateString(date)) return new Date(date)
		if (isNumberString(value)) return +value
		return value
	}

	private getFilter = (filter: Record<string, any>) => {
		const conditionErrors: string[] = []
		const result = Object.entries(filter).reduce((acc, [key, value]) => {
			const [parentKey, childKey] = key.split('.')

			if (Array.isArray(value)) {
				acc[parentKey] = { $in: value }
				return acc
			}
			// if the query key is not yet in acc
			if (!acc[parentKey]) {
				if (childKey) {
					if (childKey in this.conditions) {
						if (childKey === 'like') {
							acc[parentKey] = { $regex: value, $options: 'i' }
						} else {
							acc[parentKey] = {
								[`$${childKey}`]: this.conditionalValue(value),
							}
						}
					} else {
						conditionErrors.push(key)
					}
				} else {
					acc[parentKey] = this.equalityValue(value)
				}
			} else {
				if (childKey) {
					if (childKey in this.conditions) {
						if (childKey === 'like') {
							acc[parentKey] = { ...acc[parentKey], $regex: value, $options: 'i' }
						} else {
							acc[parentKey][`$${childKey}`] = this.conditionalValue(value)
						}
					} else {
						conditionErrors.push(key)
					}
				} else {
					acc[parentKey] = { ...acc[parentKey], ...this.equalityValue(value) }
				}
			}
			return acc
		}, {})
		return { result, conditionErrors }
	}
}
