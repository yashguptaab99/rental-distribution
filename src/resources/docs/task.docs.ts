import { IDocs } from '@rental-distribution/resources/docs/types'

export const TASK_DOCS: IDocs = {
	FETCHED: { detail: 'Find Task', response: 'Task fetched response' },
	CREATED: { detail: 'Create a Task', response: 'Task created response' },
	RETRIEVED: { detail: 'Get a Task', response: 'Task details retrieved response' },
	DELETED: { detail: 'Delete a Task', response: 'Task removed response' },
	MODIFIED: { detail: 'Modify a Task', response: 'Task details modified response' },
	UPDATE_STATUS: { detail: 'Update Task status', response: 'Task status update response' },
}
