import { IBaseModel } from '@rental-distribution/interfaces/base.types'

export interface ITask extends IBaseModel {
	timestamp: number
	details: any
	isEmitted: boolean
}

export type ICreateTask = Omit<ITask, keyof IBaseModel>
export type IUpdateTask = Partial<ICreateTask>
