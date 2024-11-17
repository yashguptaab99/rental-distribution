export class UpsertResponse<T> {
	status: 'created' | 'updated'

	value: T
}
