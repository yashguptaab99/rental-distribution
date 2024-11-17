import { Controller, Get, HttpCode, HttpStatus, Param, Query, Req, UseInterceptors } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { FindQuery, GetPaginationDto } from '@rental-distribution/core/models'
import { TASK_DOCS } from '@rental-distribution/resources/docs'

import { ITask } from '@rental-distribution/interfaces/task.types'
import { TaskResponseDTO } from '@rental-distribution/modules/task/dto'
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
}
