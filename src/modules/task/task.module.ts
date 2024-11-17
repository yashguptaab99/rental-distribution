import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Task, TaskRepository, TaskSchema } from '@task-manager/modules/task/data'
import { TaskService } from '@task-manager/modules/task/service'
import { TaskController } from '@task-manager/modules/task/task.controller'

@Module({
	imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
	providers: [TaskRepository, TaskService],
	controllers: [TaskController],
})
export class TaskModule {}
