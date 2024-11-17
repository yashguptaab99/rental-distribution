import { ID } from '@rental-distribution/interfaces/id.types'

export interface IBaseModel {
	/**
	 * The entity id
	 */
	_id: ID
	/**
	 * The entity created date
	 */
	createdAt: Date
	/**
	 * The entity updated date
	 */
	updatedAt: Date
}

export interface IOwner {
	/**
	 * The unique identifier for the owner user.
	 * @type {ID}
	 */
	userId: ID

	/**
	 * The email address of the owner user.
	 * @type {string}
	 */
	email: string
}
