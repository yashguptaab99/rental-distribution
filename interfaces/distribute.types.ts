export enum FREQUENCY_ENUM {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
	TEN_SECONDS = 'ten_seconds',
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
