export interface IPaginationMetaItem {
	/**
	 * The total amount of items
	 */
	totalItems?: number
	/**
	 * The items requested on the page
	 */
	limit: number
	/**
	 * The first item number on the page
	 */
	begins: number
	/**
	 * The last item number on the page
	 */
	ends: number
}

export interface IPaginationMetaPage {
	/**
	 * Current Page
	 */
	current: number
	/**
	 * Previous page number
	 */
	previous: number | null
	/**
	 * Next page number
	 */
	next: number | null
	/**
	 * Total amount of pages available
	 */
	total: number
	/**
	 * Current page size
	 */
	size: number
}

export interface IPaginationMeta {
	/**
	 * Items pagination info
	 */
	items: IPaginationMetaItem
	/**
	 * Page info
	 */
	page: IPaginationMetaPage
}

export interface IPaginatedResponse<T> {
	/**
	 * List of resource items
	 */
	data: T[]
	/**
	 * Pagination meta data
	 */
	meta: IPaginationMeta
}

export interface IPaginationQuery {
	/**
	 * The amount of items requested on the page
	 */
	limit?: number
	/**
	 * The page requested
	 */
	page?: number
}
