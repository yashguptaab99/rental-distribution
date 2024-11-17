import { FindQuery, PaginatedResponse } from '@task-manager/core/models'

import { IFilter } from '@task-manager/interfaces/query.types'

interface IWrite<T> {
	create(item: T, arg?: any): Promise<T>
	update(id: string, item: T): Promise<void>
	delete(id: string): Promise<void>
}

interface IRead<T> {
	findAll(query: FindQuery<T>): Promise<PaginatedResponse<T>>
	findById(id: string): Promise<T>
}

export interface IBaseService extends IRead<object>, IWrite<object> {}

export interface IPartialService<T> {
	findById(id: string): Promise<T>
}

export interface IResourceMemberService {
	checkExists(userId: string, resourceId: string): Promise<boolean>
}

export interface IPartialQueryService<T> {
	findOneBy(query: IFilter<T>): Promise<T>
}
