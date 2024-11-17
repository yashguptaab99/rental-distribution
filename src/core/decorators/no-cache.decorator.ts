import { SetMetadata } from '@nestjs/common'

export const NoCache = () => SetMetadata(NO_CACHE_KEY, true)

export const NO_CACHE_KEY = 'ignoreCaching'
