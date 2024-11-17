import { Injectable } from '@nestjs/common'
import { PipelineStage, Types } from 'mongoose'

import { BaseRepository } from '@task-manager/core/base'
import { FindQuery } from '@task-manager/core/models'

import { IPaginatedResponse } from '@task-manager/interfaces/pagination.types'
import { IFilter } from '@task-manager/interfaces/query.types'

export interface AggregationResult<T> {
	data: T[]
	total: number
}

export type QueryMapper = (value: any) => Record<string, () => { key: string; value: any }>

@Injectable()
export class PaginationHelper<T> {
	aggregation(options: FindQuery<T>, queryMapper?: QueryMapper, exclude?: Record<string, number>) {
		const { limit = 25, page = 1, filter = {}, sort = { updatedAt: -1 } } = options
		return [
			{
				$match: this.matchLogic(filter, queryMapper),
			},
			{
				$facet: {
					total: [{ $count: 'count' }],
					data: [
						{ $sort: sort },
						{ $skip: (page - 1) * limit },
						{ $limit: +limit },
						{ $project: { ...exclude, __v: 0 } },
					],
				},
			},
		]
	}

	response<T>(response: AggregationResult<T>, page = 1, limit = 25): IPaginatedResponse<T> {
		const { total, data } = response

		const lastPage = Math.ceil(total / limit)
		const nextPage = page + 1 > lastPage ? null : page + 1
		const prevPage = page - 1 < 1 ? null : page - 1
		const begins = total ? limit * +prevPage + 1 : 0
		return {
			data: data,
			meta: {
				items: {
					totalItems: total,
					limit,
					begins,
					ends: begins + (data.length ? data.length - 1 : 0),
				},
				page: {
					current: page,
					previous: prevPage,
					next: nextPage,
					total: lastPage,
					size: data.length,
				},
			},
		}
	}

	matchLogic = (filter: IFilter<T>, queryMapper?: QueryMapper) => {
		const matchObject = Object.entries(filter).reduce((acc, [key, value]) => {
			const mapQuery = queryMapper?.(value)?.[key]?.()
			if (mapQuery) {
				const { key: mappedKey, value: mappedValue } = mapQuery
				acc[mappedKey] = mappedValue
			} else {
				const queryValue = BaseRepository.isValidObjectId(value) ? new Types.ObjectId(value) : value
				acc[key] = BaseRepository.isValidObjectId(value?.$eq) ? { $eq: new Types.ObjectId(value.$eq) } : queryValue
			}
			return acc
		}, {})

		return matchObject
	}

	facetPipeline = ({ sort, page, limit }, pipeStage: PipelineStage.FacetPipelineStage[] = []) => ({
		total: [{ $count: 'count' }],
		data: [{ $sort: sort }, { $skip: (page - 1) * limit }, { $limit: +limit }, ...pipeStage],
	})
}
