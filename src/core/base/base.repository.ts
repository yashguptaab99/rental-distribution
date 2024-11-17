import { ClientSession, Model, Types, UpdateQuery, isValidObjectId as mongooseIsValidObjectId } from 'mongoose'

import { FindQuery, UpsertResponse } from '@rental-distribution/core/models'
import { PaginationHelper, QueryMapper } from '@rental-distribution/core/pagination'

import { IBaseModel } from '@rental-distribution/interfaces/base.types'
import { IPaginatedResponse } from '@rental-distribution/interfaces/pagination.types'

type DocumentType<T> = Omit<T, keyof IBaseModel> | Record<string, any>
export type IFilter<T> = Partial<Record<keyof T, string>> | Record<string, any>
type FindOptions = {
	select?: Record<string, number>
}

export class BaseRepository<T> {
	constructor(
		private readonly repo: Model<T>,
		private pageHelper: PaginationHelper<T>
	) {}

	public static isValidObjectId(value: any) {
		const isValid = mongooseIsValidObjectId(value)
		if (!isValid) return false

		const inObjectId = new Types.ObjectId(value)
		return inObjectId.toString() === value
	}

	private castToObjectId(conditions: IFilter<T>) {
		Object.entries(conditions).forEach(([key, value]) => {
			if (BaseRepository.isValidObjectId(value)) conditions[key] = new Types.ObjectId(value)
		})
	}

	async findMany(query: IFilter<T>, options?: FindOptions, session?: ClientSession) {
		this.castToObjectId(query)
		return this.repo
			.find(query)
			.select({ __v: 0, ...(options?.select || {}) })
			.session(session)
			.lean()
			.exec()
	}

	async deleteAll(query: IFilter<T>, session?: ClientSession) {
		this.castToObjectId(query)
		await this.repo.deleteMany(query).session(session)
	}

	async deleteOneBy(conditions: IFilter<T>, session?: ClientSession) {
		this.castToObjectId(conditions)
		await this.repo.deleteOne(conditions).session(session)
	}

	async updateOneBy(conditions: IFilter<T>, data: UpdateQuery<T>, session?: ClientSession) {
		this.castToObjectId(conditions)
		await this.repo.updateOne(conditions, data).session(session)
	}

	async findOneBy(conditions: IFilter<T>, session?: ClientSession) {
		this.castToObjectId(conditions)
		return this.repo.findOne(conditions).session(session).lean().exec()
	}

	async exists(conditions: IFilter<T>, session?: ClientSession): Promise<boolean> {
		this.castToObjectId(conditions)
		return this.repo
			.countDocuments(conditions, { limit: 1 })
			.session(session)
			.then((data) => !!data)
	}

	async bulkCreate(items: DocumentType<T>[], session?: ClientSession): Promise<Record<number, Types.ObjectId>> {
		const result = await this.repo.insertMany(items, { rawResult: true, session })
		return result.insertedIds
	}

	async upsert(conditions: IFilter<T>, data: UpdateQuery<T>): Promise<UpsertResponse<T>> {
		this.castToObjectId(conditions)

		const { lastErrorObject, value } = await this.repo
			.findOneAndUpdate(conditions, data, { upsert: true, includeResultMetadata: true, new: true })
			.exec()

		const status = lastErrorObject.updatedExisting ? 'updated' : 'created'
		return { status, value }
	}

	async findById(id: string, options?: FindOptions, session?: ClientSession) {
		return this.repo
			.findById(new Types.ObjectId(id))
			.select({ __v: 0, ...(options?.select || {}) })
			.lean()
			.session(session)
			.exec()
	}

	async updateById(id: string, data: UpdateQuery<T>, session?: ClientSession) {
		await this.repo.updateOne({ _id: new Types.ObjectId(id) }, data).session(session)
	}

	async findByIdAndUpdate(id: string, data: UpdateQuery<T>, session?: ClientSession) {
		return this.repo.findByIdAndUpdate(new Types.ObjectId(id), data).session(session)
	}

	async findOneAndUpdate(conditions: IFilter<T>, data: UpdateQuery<T>, session?: ClientSession) {
		this.castToObjectId(conditions)
		return this.repo.findOneAndUpdate(conditions, data, { new: true }).session(session)
	}

	async delete(id: string, session?: ClientSession) {
		await this.repo.deleteOne({ _id: new Types.ObjectId(id) }).session(session)
	}

	async create(resource: Omit<DocumentType<T>, 'status'>, session?: ClientSession) {
		this.castToObjectId(resource)
		const data = await new this.repo(resource).save({ session })
		return data.toObject<T>({ versionKey: false })
	}

	async findAll(
		options: FindQuery<T>,
		queryMapper?: QueryMapper,
		exclude?: Record<string, number>
	): Promise<IPaginatedResponse<T>> {
		const { limit = 25, page = 1 } = options

		const [{ data, total }] = await this.repo.aggregate(this.pageHelper.aggregation(options, queryMapper, exclude), {
			collation: { locale: 'en', strength: 1 },
		})

		return this.pageHelper.response({ data, total: total[0]?.count || 0 }, page, limit)
	}

	async updateMany(query: IFilter<T>, data: UpdateQuery<T>, session?: ClientSession) {
		this.castToObjectId(query)
		await this.repo.updateMany(query, data).session(session)
	}
}
