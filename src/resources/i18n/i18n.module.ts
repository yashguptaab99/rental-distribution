import { DynamicModule, Module } from '@nestjs/common'
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n'

@Module({})
export class TranslationModule {
	static forRoot(): DynamicModule {
		return I18nModule.forRoot({
			fallbackLanguage: 'en',
			loaderOptions: {
				path: 'src/resources/i18n',
				watch: true,
			},
			resolvers: [
				new HeaderResolver(['x-custom-lang']),
				{ use: QueryResolver, options: ['lang'] },
				AcceptLanguageResolver,
			],
		})
	}
}
