export enum FREQUENCY_ENUM {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
}

export interface ICreateDistribution {
	startTime: string
	endTime: string
	frequency: FREQUENCY_ENUM
	executionDate?: string
}

export interface ICreateDistributionResponse {
	message: string
	taskTimestamps: number[]
}
