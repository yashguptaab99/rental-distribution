import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator'

import { FREQUENCY_ENUM, ICreateDistribution } from '@rental-distribution/interfaces/distribute.types'

export class CreateDistributionDto implements ICreateDistribution {
	@ApiProperty({
		description: 'The start time of the task schedule in ISO 8601 format.',
		example: '2023-01-01T00:00:00Z',
	})
	@IsDateString()
	@IsNotEmpty()
	startTime: string

	@ApiProperty({
		description: 'The end time of the task schedule in ISO 8601 format.',
		example: '2023-01-05T00:00:00Z',
	})
	@IsDateString()
	@IsNotEmpty()
	endTime: string

	@ApiProperty({
		description: 'The frequency of task execution.',
		example: FREQUENCY_ENUM.DAILY,
		enum: FREQUENCY_ENUM,
	})
	@IsEnum(FREQUENCY_ENUM)
	frequency: FREQUENCY_ENUM

	@ApiPropertyOptional({
		description: 'Specific execution date in ISO 8601 format. Required if frequency is not provided.',
		example: '2023-01-03T00:00:00Z',
	})
	@IsDateString()
	@IsOptional()
	@ValidateIf((o) => !o.frequency)
	executionDate?: string
}
