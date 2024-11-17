export enum FREQUENCY_ENUM {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
}

export interface ICreateTask {
	startTime: string
	endTime: string
	frequency: FREQUENCY_ENUM
	executionDate?: string
}

export interface ICreateTaskResponse {
	message: string
	taskTimestamps: number[]
}
