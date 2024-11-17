import { Prop, SchemaFactory } from '@nestjs/mongoose'

import { ITaskStatus, TaskStatusEnum } from '@rental-distribution/interfaces/task.types'

export class TaskStatus implements ITaskStatus {
	constructor(status = TaskStatusEnum.TODO) {
		this.id = status
		this.timestamp = new Date()
	}

	@Prop({ enum: TaskStatusEnum, type: String, default: TaskStatusEnum.TODO, index: true })
	id: TaskStatusEnum

	@Prop({ default: Date.now() })
	timestamp: Date
}

export const TaskStatusSchema = SchemaFactory.createForClass(TaskStatus)
