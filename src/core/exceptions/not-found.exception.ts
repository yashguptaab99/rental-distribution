import { NotFoundException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

export class ResourceNotFoundError extends NotFoundException {
	constructor(i18n: I18nService, resource: string) {
		super(i18n.t('exceptions.RESOURCE.NOT_FOUND', { args: { resource } }))
	}
}
