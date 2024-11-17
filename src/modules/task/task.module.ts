import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Task, TaskRepository, TaskSchema } from '@rental-distribution/modules/task/data'
import { TaskService } from '@rental-distribution/modules/task/service'
import { TaskController } from '@rental-distribution/modules/task/task.controller'

@Module({
	imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
	providers: [TaskRepository, TaskService],
	controllers: [TaskController],
	exports: [TaskService],
})
export class TaskModule {}
