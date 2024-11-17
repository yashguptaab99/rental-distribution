import { ApiResponseProperty } from '@nestjs/swagger'
import { Allow, Validate } from 'class-validator'
import { Types } from 'mongoose'

import { NoEmptyBodyRule } from '@rental-distribution/core/validator-rules'

import { IBaseModel, IOwner } from '@rental-distribution/interfaces/base.types'

export class BaseDTO implements IBaseModel {
	@ApiResponseProperty({ type: () => String, example: '507f191e810c19729de860ea' })
	readonly _id: Types.ObjectId

	@ApiResponseProperty({ type: () => Date, example: '2022-08-01T14:09:36.071+00:00' })
	readonly createdAt: Date

	@ApiResponseProperty({ type: () => Date, example: '2022-08-01T14:09:36.071+00:00' })
	readonly updatedAt: Date
}

export class OwnerDTO implements IOwner {
	@ApiResponseProperty({ type: () => String, example: '507f191e810c19729de860ea' })
	userId: Types.ObjectId

	@ApiResponseProperty({ type: () => String, example: 'andre@scal.io' })
	email: string
}

export class BaseUpdateDTO {
	@Validate(NoEmptyBodyRule)
	@Allow()
	protected checkEmpty?: never
}
