import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, Min, ValidateIf } from 'class-validator'

import { FREQUENCY_ENUM, ICreateDistribution } from '@rental-distribution/interfaces/distribute.types'

export class CreateDistributionDto implements ICreateDistribution {
	@IsDateString()
	@IsNotEmpty()
	@ApiProperty({ example: '2023-01-01T00:00:00Z' })
	startTime: string

	@IsDateString()
	@IsNotEmpty()
	@ApiProperty({ example: '2023-01-05T00:00:00Z' })
	endTime: string

	@IsEnum(FREQUENCY_ENUM)
	@ApiProperty({ example: FREQUENCY_ENUM.DAILY, enum: FREQUENCY_ENUM })
	frequency: FREQUENCY_ENUM

	@IsNumber()
	@Min(0)
	@ApiProperty({ example: 100 })
	distributionAmount: number

	@IsDateString()
	@IsOptional()
	@ValidateIf((o) => !o.frequency)
	@ApiPropertyOptional({ example: '2023-01-03T00:00:00Z' })
	executionDate?: string
}
