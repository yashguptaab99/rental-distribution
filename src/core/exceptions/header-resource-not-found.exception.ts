import { NotFoundException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

export class HeaderResourceNotFoundError extends NotFoundException {
	constructor(i18n: I18nService, resource: string) {
		super(i18n.t('exceptions.RESOURCE.HEADER_NOT_FOUND', { args: { resource } }))
	}
}
