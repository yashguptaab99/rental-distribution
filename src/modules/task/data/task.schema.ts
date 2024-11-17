import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { BaseSchema } from '@rental-distribution/core/base'

import { ITask } from '@rental-distribution/interfaces/task.types'

@Schema({ timestamps: true })
export class Task extends BaseSchema implements ITask {
	@Prop({ type: Number, required: true })
	timestamp: number

	@Prop({ type: Object, required: true })
	details: any

	@Prop({ type: Boolean, required: true, default: false })
	isEmitted: boolean
}

export const TaskSchema = SchemaFactory.createForClass(Task)
