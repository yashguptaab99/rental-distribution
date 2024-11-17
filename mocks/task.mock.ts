import { ITask, TaskStatusEnum } from '@rental-distribution/interfaces/task.types'

export const mockCreateTask = () => ({
	name: 'Task',
	description: 'Tasks Description',
	dueDate: new Date('2022-08-01T14:09:36.071Z'),
})

export const mockTask: ITask = {
	_id: '1',
	name: 'Test Task',
	description: 'Test Description',
	dueDate: new Date(),
	status: { id: TaskStatusEnum.TODO, timestamp: new Date() },
	createdAt: new Date(),
	updatedAt: new Date(),
}

export const mockUpdateTask = () => ({
	name: 'Updated Task',
})

export const tasks = [
	mockTask,
	{
		...mockTask,
		_id: '2',
		name: 'Another Task',
	},
]

export const findTask = {
	data: [mockTask],
	meta: {
		items: {
			totalItems: 1,
			limit: 10,
			begins: 1,
			ends: 1,
		},
		page: {
			current: 1,
			previous: null,
			next: null,
			total: 1,
			size: 1,
		},
	},
}
