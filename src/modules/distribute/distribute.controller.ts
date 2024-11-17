import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger'

import { DISTRIBUTE_DOCS } from '@rental-distribution/resources/docs'

import { CreateTaskDto, CreateTaskResponseDTO } from '@rental-distribution/modules/distribute/dto'
import { DistributeService } from '@rental-distribution/modules/distribute/service'

const docs = DISTRIBUTE_DOCS

@Controller('distribute')
export class DistributeController {
	constructor(private readonly distributeService: DistributeService) {}

	@ApiOperation({ summary: docs.CREATED.detail })
	@ApiCreatedResponse({
		description: docs.CREATED.response,
		type: CreateTaskResponseDTO,
	})
	@Post()
	@HttpCode(HttpStatus.CREATED)
	distribute(@Body() body: CreateTaskDto) {
		return this.distributeService.createTasks(body)
	}
}
