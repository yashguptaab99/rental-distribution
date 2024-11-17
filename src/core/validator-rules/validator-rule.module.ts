import { Global, Module } from '@nestjs/common'

import { NoEmptyBodyRule } from '@task-manager/core/validator-rules'

@Global()
@Module({
	providers: [NoEmptyBodyRule],
	exports: [NoEmptyBodyRule],
})
export class ValidatorRulesModule {}
