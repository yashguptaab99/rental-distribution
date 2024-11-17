import { Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { IBaseService } from '@rental-distribution/core/base'
import { ResourceNotFoundError } from '@rental-distribution/core/exceptions'
import { FindQuery, PaginatedResponse } from '@rental-distribution/core/models'

import { ICreateTask, IUpdateTask } from '@rental-distribution/interfaces/task.types'
import { Task, TaskRepository } from '@rental-distribution/modules/task/data'
import { TaskResponseDTO } from '@rental-distribution/modules/task/dto'

@Injectable()
export class TaskService implements Partial<IBaseService> {
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

	async create(data: ICreateTask): Promise<TaskResponseDTO> {
		return this.taskRepository.create(data)
	}

	async update(id: string, data: IUpdateTask): Promise<void> {
		await this.taskRepository.updateById(id, data)
	}
}
