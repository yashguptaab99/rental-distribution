import { Prop, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import { IOwner } from '@task-manager/interfaces/base.types'

export class RawBaseSchema {
	_id: Types.ObjectId

	@Prop()
	createdAt: Date

	@Prop()
	updatedAt: Date

	constructor() {
		this.updatedAt = new Date()
		this.createdAt = new Date()
		this._id = new Types.ObjectId()
	}
}

export class BaseSchema extends RawBaseSchema {
	@Prop({ select: false })
	__v?: number
}

export class Owner implements IOwner {
	@Prop({ type: () => Types.ObjectId })
	userId: Types.ObjectId

	@Prop()
	email: string
}
export const OwnerSchema = SchemaFactory.createForClass(Owner)
