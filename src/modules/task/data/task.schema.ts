import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { BaseSchema } from '@rental-distribution/core/base'

import { ITask, ITaskStatus } from '@rental-distribution/interfaces/task.types'
import { TaskStatus, TaskStatusSchema } from '@rental-distribution/modules/task/data'

@Schema({ timestamps: true })
export class Task extends BaseSchema implements ITask {
	@Prop({ type: String })
	name: string

	@Prop({ type: String, required: false })
	description?: string

	@Prop({ type: Date })
	dueDate: Date

	@Prop({ type: () => TaskStatusSchema, default: () => new TaskStatus() })
	status: ITaskStatus
}

export const TaskSchema = SchemaFactory.createForClass(Task).index({ name: 'text' })
