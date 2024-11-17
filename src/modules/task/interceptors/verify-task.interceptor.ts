import { Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { BaseVerifyInterceptor } from '@rental-distribution/core/interceptors'

import { ITask } from '@rental-distribution/interfaces/task.types'
import { TaskService } from '@rental-distribution/modules/task/service'

@Injectable()
export class VerifyTask extends BaseVerifyInterceptor<ITask> {
	constructor(taskService: TaskService, i18nService: I18nService) {
		super(taskService, { name: 'task', id: 'taskId' }, i18nService)
	}
}
