import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseInterceptors,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { FindQuery, GetPaginationDto } from '@rental-distribution/core/models'
import { TASK_DOCS } from '@rental-distribution/resources/docs'

import { ITask } from '@rental-distribution/interfaces/task.types'
import {
	ChangeTaskStatusDTO,
	CreateTaskDTO,
	TaskResponseDTO,
	UpdateTaskDTO,
} from '@rental-distribution/modules/task/dto'
import { VerifyTask } from '@rental-distribution/modules/task/interceptors'
import { TaskService } from '@rental-distribution/modules/task/service'

const docs = TASK_DOCS
export class PaginatedTask extends GetPaginationDto(TaskResponseDTO) {}

@ApiTags('Tasks API')
@UseInterceptors(VerifyTask)
@Controller('tasks')
export class TaskController {
	constructor(private taskService: TaskService) {}

	@ApiOperation({ summary: docs.FETCHED.detail })
	@ApiOkResponse({
		description: docs.FETCHED.response,
		type: PaginatedTask,
	})
	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(@Query() query: FindQuery<ITask>): Promise<PaginatedTask> {
		return await this.taskService.findAll(query)
	}

	@ApiOperation({ summary: docs.RETRIEVED.detail })
	@ApiOkResponse({
		description: docs.RETRIEVED.response,
		type: TaskResponseDTO,
	})
	@Get(':taskId')
	findById(@Param('taskId') id: string, @Req() { task }: { task: ITask }): TaskResponseDTO {
		return task
	}

	@ApiOperation({ summary: docs.CREATED.detail })
	@ApiCreatedResponse({
		description: docs.CREATED.response,
		type: TaskResponseDTO,
	})
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateTaskDTO): Promise<TaskResponseDTO> {
		return await this.taskService.create(body)
	}

	@ApiOperation({ summary: docs.MODIFIED.detail })
	@ApiNoContentResponse({
		description: docs.MODIFIED.response,
		type: null,
	})
	@Patch(':taskId')
	@HttpCode(204)
	async update(@Param('taskId') id: string, @Body() body: UpdateTaskDTO) {
		await this.taskService.update(id, body)
	}

	@ApiOperation({ summary: docs.DELETED.detail })
	@ApiNoContentResponse({
		description: docs.DELETED.response,
		type: null,
	})
	@HttpCode(204)
	@Delete(':taskId')
	delete(@Param('taskId') id: string) {
		return this.taskService.delete(id)
	}

	@ApiOperation({ summary: docs.UPDATE_STATUS.detail })
	@ApiNoContentResponse({
		description: docs.UPDATE_STATUS.response,
		type: null,
	})
	@HttpCode(204)
	@Post(':taskId/status')
	changeStatus(@Body() body: ChangeTaskStatusDTO, @Param('taskId') taskId: string) {
		return this.taskService.changeStatus(taskId, body.status)
	}
}
