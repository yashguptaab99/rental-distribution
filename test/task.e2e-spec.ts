/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common'
import { Connection, Types } from 'mongoose'
import request from 'supertest'

import { mockCreateTask, mockUpdateTask } from '@rental-distribution/mocks/task.mock'

import { TaskModule } from '@rental-distribution/modules/task/task.module'

import { isSorted, setupFactory } from './utils'

describe('Tests for Task APIs', () => {
	let app: INestApplication
	let db: Connection

	jest.setTimeout(100000)

	beforeAll(async () => {
		({ app, db } = await setupFactory(TaskModule))
	})

	afterAll(async () => {
		await db.dropDatabase()
		await app.close()
	})

	describe('POST /tasks', () => {
		it('Should create a task successfully', async () => {
			const response = await request(app.getHttpServer()).post('/tasks').send(mockCreateTask())
			expect(response.statusCode).toBe(201)
		})

		it('Should return validation error for empty name', async () => {
			const task = { ...mockCreateTask(), name: '' }
			const response = await request(app.getHttpServer()).post('/tasks').send(task)
			const { body, statusCode } = response
			expect(statusCode).toBe(400)
			expect(body).toMatchObject({
				message: 'Bad Request',
				errors: ['name should not be empty'],
			})
		})

		it('Should return validation error for invalid dueDate', async () => {
			const task = { ...mockCreateTask(), dueDate: 'invalid-date' }
			const response = await request(app.getHttpServer()).post('/tasks').send(task)
			const { body, statusCode } = response
			expect(statusCode).toBe(400)
			expect(body).toMatchObject({
				message: 'Bad Request',
				errors: ['dueDate must be a valid date string'],
			})
		})
	})

	describe('GET /tasks/:taskId', () => {
		let taskId: string

		beforeAll(async () => {
			const response = await request(app.getHttpServer()).post('/tasks').send(mockCreateTask())
			taskId = response.body._id
		})

		it('Should retrieve task successfully', async () => {
			const response = await request(app.getHttpServer()).get(`/tasks/${taskId}`)
			expect(response.statusCode).toBe(200)
			expect(response.body._id).toEqual(taskId)
		})

		it('Should return 404 for non-existing task', async () => {
			const nonExistingId = '507f1f77bcf86cd799439011'
			const response = await request(app.getHttpServer()).get(`/tasks/${nonExistingId}`)
			expect(response.statusCode).toBe(404)
			expect(response.body).toMatchObject({ message: 'Not Found', errors: ['Task not found'] })
		})

		it('Should return validation error for invalid taskId', async () => {
			const invalidId = 'invalid-id'
			const response = await request(app.getHttpServer()).get(`/tasks/${invalidId}`)
			expect(response.statusCode).toBe(400)
			expect(response.body).toMatchObject({
				message: 'Bad Request',
				errors: ['params.taskId is not a valid ID'],
			})
		})
	})

	describe('PATCH /tasks/:taskId', () => {
		let taskId: string

		beforeAll(async () => {
			const response = await request(app.getHttpServer()).post('/tasks').send(mockCreateTask())
			taskId = response.body._id
		})

		it('Should update task successfully', async () => {
			const updatedTask = mockUpdateTask()
			const response = await request(app.getHttpServer()).patch(`/tasks/${taskId}`).send(updatedTask)
			const findUpdated = await db.collection('tasks').findOne({ _id: new Types.ObjectId(taskId) })
			expect(response.statusCode).toBe(204)
			expect(findUpdated.name).toBe(updatedTask.name)
		})

		it('Should return validation error for empty name', async () => {
			const response = await request(app.getHttpServer()).patch(`/tasks/${taskId}`).send({ name: '' })
			expect(response.statusCode).toBe(400)
			expect(response.body).toMatchObject({
				message: 'Bad Request',
				errors: ['name should not be empty'],
			})
		})

		it('Should return 404 for non-existing task', async () => {
			const nonExistingId = '507f1f77bcf86cd799439011'
			const response = await request(app.getHttpServer()).patch(`/tasks/${nonExistingId}`).send(mockUpdateTask())
			expect(response.statusCode).toBe(404)
			expect(response.body).toMatchObject({ message: 'Not Found', errors: ['Task not found'] })
		})

		it('Should return validation error for invalid taskId', async () => {
			const invalidId = 'invalid-id'
			const response = await request(app.getHttpServer()).patch(`/tasks/${invalidId}`).send(mockUpdateTask())
			expect(response.statusCode).toBe(400)
			expect(response.body).toMatchObject({
				message: 'Bad Request',
				errors: ['params.taskId is not a valid ID'],
			})
		})
	})

	describe('DELETE /tasks/:taskId', () => {
		let taskId: string

		beforeAll(async () => {
			const response = await request(app.getHttpServer()).post('/tasks').send(mockCreateTask())
			taskId = response.body._id
		})

		it('Should delete task successfully', async () => {
			const response = await request(app.getHttpServer()).delete(`/tasks/${taskId}`)
			const { statusCode } = response
			const entry = await db.collection('tasks').findOne({ _id: new Types.ObjectId(taskId) })
			expect(statusCode).toBe(204)
			expect(entry).toBe(null)
		})

		it('Should return 404 for non-existing task', async () => {
			const nonExistingId = '507f1f77bcf86cd799439011'
			const response = await request(app.getHttpServer()).delete(`/tasks/${nonExistingId}`)
			const { statusCode, body } = response
			expect(statusCode).toBe(404)
			expect(body).toMatchObject({ message: 'Not Found', errors: ['Task not found'] })
		})

		it('Should return validation error for invalid taskId', async () => {
			const invalidId = 'invalid-id'
			const response = await request(app.getHttpServer()).delete(`/tasks/${invalidId}`)
			const { statusCode, body } = response
			expect(statusCode).toBe(400)
			expect(body).toMatchObject({
				message: 'Bad Request',
				errors: ['params.taskId is not a valid ID'],
			})
		})
	})

	describe('GET /tasks', () => {
		beforeAll(async () => {
			await db.collection('tasks').deleteMany({})
			await request(app.getHttpServer()).post('/tasks').send(mockCreateTask())
			await request(app.getHttpServer())
				.post('/tasks')
				.send({ ...mockCreateTask(), name: 'Another' })
		})

		it('Should fetch entries successfully', async () => {
			const response = await request(app.getHttpServer()).get('/tasks')
			const { meta, data } = response.body
			expect(response.statusCode).toBe(200)
			expect(Array.isArray(data)).toBe(true)
			expect(meta).toEqual({
				items: { totalItems: 2, limit: 25, begins: 1, ends: 2 },
				page: { current: 1, previous: null, next: null, total: 1, size: 2 },
			})
		})

		it('Should filter tasks by name', async () => {
			const { name } = mockCreateTask()
			const response = await request(app.getHttpServer()).get(`/tasks?name=${name}`)
			const { data } = response.body
			expect(Array.isArray(data)).toBe(true)
			expect(data.length).toBe(1)
			expect(data.every((item) => item.name.startsWith(name))).toBe(true)
		})

		it('Should sort tasks by name in ascending order', async () => {
			const response = await request(app.getHttpServer()).get('/tasks?sort=name.asc')
			const { data } = response.body
			expect(isSorted(data, 'name', 'asc')).toBe(true)
		})

		it('Should sort entries by name descending', async () => {
			const response = await request(app.getHttpServer()).get('/tasks?sort=name.desc')
			const { data } = response.body
			expect(isSorted(data, 'name', 'desc')).toBe(true)
		})

		it('Should perform correct pagination', async () => {
			const response = await request(app.getHttpServer()).get(`/tasks?page=2&limit=1`)
			const { meta } = response.body
			expect(meta).toEqual({
				items: { totalItems: 2, limit: 1, begins: 2, ends: 2 },
				page: { current: 2, previous: 1, next: null, total: 2, size: 1 },
			})
		})

		it('Should return empty array if page is exceeded', async () => {
			const response = await request(app.getHttpServer()).get(`/tasks?page=10&limit=5`)
			const { data } = response.body
			expect(data.length).toBe(0)
		})

		it('Should return sorted entries with pagination', async () => {
			const response = await request(app.getHttpServer()).get(`/tasks?page=1&limit=4&sort=name.asc`)
			const { data, meta } = response.body
			expect(isSorted(data, 'name', 'asc')).toBe(true)
			expect(meta).toEqual({
				items: { totalItems: 2, limit: 4, begins: 1, ends: 2 },
				page: { current: 1, previous: null, next: null, total: 1, size: 2 },
			})
		})
	})
})
