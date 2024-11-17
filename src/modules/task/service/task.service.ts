import { Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { IBaseService } from '@task-manager/core/base'
import { FindQuery, PaginatedResponse } from '@task-manager/core/models'
import { ResourceNotFoundError } from '@task-manager/core/exceptions'

import { Task, TaskRepository } from '@task-manager/modules/task/data'
import { CreateTaskDTO, TaskResponseDTO, UpdateTaskDTO } from '@task-manager/modules/task/dto'
import { TaskStatusEnum } from '@task-manager/interfaces/task.types'

@Injectable()
export class TaskService implements IBaseService {
	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly i18n: I18nService
	) {}

	findAll(query: FindQuery<Task>): Promise<PaginatedResponse<Task>> {
		return this.taskRepository.findAll(query)
	}

	async findById(id: string): Promise<TaskResponseDTO> {
		const task = await this.taskRepository.findById(id)
		if (!task) throw new ResourceNotFoundError(this.i18n, 'Task')
		return task
	}

	async create(data: CreateTaskDTO): Promise<TaskResponseDTO> {
		return this.taskRepository.create(data)
	}

	async update(id: string, data: UpdateTaskDTO): Promise<void> {
		await this.taskRepository.updateById(id, data)
	}

	async delete(id: string): Promise<void> {
		await this.taskRepository.delete(id)
	}

	async changeStatus(taskId: string, status: TaskStatusEnum): Promise<void> {
		const update = { status: { id: status, timestamp: new Date() } }
		await this.taskRepository.updateById(taskId, update)
	}
}
