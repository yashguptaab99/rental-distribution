import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

import { BaseUpdateDTO } from '@rental-distribution/core/models'
import { enumString, trimField } from '@rental-distribution/core/utils'
import { MESSAGES } from '@rental-distribution/resources/i18n'

import { IChangeTaskStatus, ICreateTask, IUpdateTask, TaskStatusEnum } from '@rental-distribution/interfaces/task.types'

export class CreateTaskDTO implements ICreateTask {
	@IsNotEmpty(MESSAGES.NOT_EMPTY)
	@MaxLength(360, MESSAGES.MAX_LENGTH)
	@IsString(MESSAGES.INVALID_STRING)
	@Transform(trimField)
	@ApiProperty({ example: 'Task Name', type: () => String })
	name: string

	@IsOptional()
	@IsString(MESSAGES.INVALID_STRING)
	@MaxLength(360, MESSAGES.MAX_LENGTH)
	@Transform(trimField)
	@ApiProperty({ example: 'Task description', type: () => String })
	description?: string

	@IsDateString({ strict: true }, MESSAGES.INVALID_DATE)
	@ApiProperty({ type: () => Date, example: '2024-04-06T14:09:36.071+00:00' })
	dueDate: Date
}

export class UpdateTaskDTO extends IntersectionType(PartialType(CreateTaskDTO), BaseUpdateDTO) implements IUpdateTask {}

export class ChangeTaskStatusDTO implements IChangeTaskStatus {
	@IsEnum(TaskStatusEnum, MESSAGES.INVALID_ENUM_VALUE)
	@ApiProperty({ enum: TaskStatusEnum, example: enumString(TaskStatusEnum) })
	status: TaskStatusEnum
}
