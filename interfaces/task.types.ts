import { IBaseModel, IOwner } from '@task-manager/interfaces/base.types'

export enum TaskStatusEnum {
	TODO = 'todo',
	IN_PROGRESS = 'in-progress',
	DONE = 'done',
}

export interface ITaskStatus {
	id: TaskStatusEnum
	timestamp: Date
}

export interface ITask extends IBaseModel {
	name: string
	description?: string
	dueDate: Date
	status: ITaskStatus
}

export type ICreateTask = Omit<ITask, keyof IBaseModel | 'status'>
export type IUpdateTask = Partial<ICreateTask>

export type IChangeTaskStatus = {
	status: TaskStatusEnum
}
