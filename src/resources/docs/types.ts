import { ApiHeaderOptions } from '@nestjs/swagger'

export interface IDocs {
	[x: string]: { detail: string; response: string; header?: ApiHeaderOptions; headers?: ApiHeaderOptions[] }
}
