import { Global, Module } from '@nestjs/common'

import { NoEmptyBodyRule } from '@rental-distribution/core/validator-rules'

@Global()
@Module({
	providers: [NoEmptyBodyRule],
	exports: [NoEmptyBodyRule],
})
export class ValidatorRulesModule {}
