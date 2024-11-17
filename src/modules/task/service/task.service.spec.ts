import { Test, TestingModule } from '@nestjs/testing'

import { ResourceNotFoundError } from '@task-manager/core/exceptions'
import { mockCreateTask, mockTask, mockUpdateTask, tasks, findTask } from '@task-manager/mocks/task.mock'
import { TranslationModule } from '@task-manager/resources/i18n'

import { TaskService } from '@task-manager/modules/task/service/task.service'
import { TaskRepository } from '@task-manager/modules/task/data'
import { TaskStatusEnum } from '@task-manager/interfaces/task.types'

describe('TaskService', () => {
	let taskService: TaskService
	let taskRepository: TaskRepository
	let module: TestingModule

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [TranslationModule.forRoot()],
			providers: [
				TaskService,
				{
					provide: TaskRepository,
					useValue: {
						findAll: jest.fn().mockResolvedValue(findTask),
						findById: jest.fn().mockImplementation((id) => tasks.find((task) => task._id === id) || null),
						create: jest.fn().mockResolvedValue(mockTask),
						updateById: jest.fn().mockResolvedValue(null),
						delete: jest.fn().mockResolvedValue(null),
					},
				},
			],
		}).compile()

		taskService = module.get<TaskService>(TaskService)
		taskRepository = module.get<TaskRepository>(TaskRepository)
	})

	afterAll(async () => {
		await module.close()
	})

	it('Should be defined', () => {
		expect(taskService).toBeDefined()
	})

	it('Should find all tasks', async () => {
		const response = await taskService.findAll({})
		expect(response).toEqual(findTask)
	})

	it('Should create a task', async () => {
		const response = await taskService.create(mockCreateTask())
		expect(response).toEqual(mockTask)
	})

	it('Should find task by id', async () => {
		const response = await taskService.findById('1')
		expect(response).toEqual(mockTask)
	})

	it('Should return resource not found', async () => {
		jest.spyOn(taskRepository, 'findById').mockResolvedValueOnce(null)
		await expect(taskService.findById('3')).rejects.toThrowError(ResourceNotFoundError)
	})

	it('Should update a task', async () => {
		await taskService.update('1', mockUpdateTask())
		expect(taskRepository.updateById).toHaveBeenCalledWith('1', mockUpdateTask())
	})

	it('Should delete a task', async () => {
		await taskService.delete('1')
		expect(taskRepository.delete).toHaveBeenCalledWith('1')
	})

	it('Should change the status of a task', async () => {
		const status = TaskStatusEnum.DONE
		await taskService.changeStatus('1', status)
		expect(taskRepository.updateById).toHaveBeenCalledWith('1', { status: { id: status, timestamp: expect.any(Date) } })
	})
})
