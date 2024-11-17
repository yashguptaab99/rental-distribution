import { IPaginationQuery } from '@task-manager/interfaces/pagination.types'

export type IFilter<T> = Partial<Record<keyof T, string>> | Record<string, any>

export type IQueryOperators = {
	gt?: string | number
	gte?: string | number
	lt?: string | number
	lte?: string | number
	like?: string
}

export interface IFindQuery<T> extends IPaginationQuery {
	sort?: Partial<Record<keyof T, 1 | -1>>
	filter?: IFilter<T>
}

export interface IQuery<T, S = T> extends IPaginationQuery {
	sort?: Partial<Record<keyof S, 'desc' | 'asc'>>
	filter?: Partial<Record<keyof T, string | IQueryOperators>>
}
