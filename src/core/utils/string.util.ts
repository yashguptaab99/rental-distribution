import { trimEnd } from 'lodash'

export function toCamelCase(input: string) {
	if (typeof input !== 'string') return input
	const text = input.replace(/[-_\s.]+(.)?/g, (_, c: string) => (c ? c.toUpperCase() : ''))
	return text.substring(0, 1).toLowerCase() + text.substring(1)
}

export const trimField = ({ value }) => (typeof value === 'string' ? value.trim() : value)

export const toLowerCase = ({ value }) => (typeof value === 'string' ? value.toLowerCase() : value)

export const castToNumber = ({ value }) => (typeof value === 'string' ? +value : value)

export const castToBoolean = ({ value }) => {
	if (value === undefined) return undefined

	if (typeof value === 'string') {
		const lowercasedValue = value.toLowerCase()
		return lowercasedValue === 'true' || lowercasedValue === '1'
	}

	return Boolean(value)
}

export const castToDate = ({ value }) => (value ? new Date(value) : value)

export const trimName = ({ value }) => {
	return typeof value === 'string' ? trimEnd(value, '-').trim().replace(/\s+/g, ' ') : value
}

/**
 * Converts a string to a slug format.
 *
 * @param input - The string to slugify.
 * @returns The slugified string.
 */
export function slugify(input: string) {
	return input
		.toLowerCase()
		.trim()
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

type AdvanceTrimOpts = 'spaces' | 'hyphens' | 'commas' | 'underline'

/**
 * Removes leading and trailing spaces, hyphens and commas, and has
 * fine controls over what to remove
 */
export function advancedTrim(
	str?: string,
	whatToRemove: AdvanceTrimOpts[] = ['commas', 'hyphens', 'spaces', 'underline']
) {
	if (!str) return str

	const removeCodes: Record<AdvanceTrimOpts, string> = {
		spaces: '\\s',
		hyphens: '-',
		commas: ',',
		underline: '_',
	}

	const expression = [...new Set(whatToRemove)]
		.map((item) => removeCodes[item])
		.filter(Boolean)
		.join('')

	const regex = new RegExp(`^[${expression}]+|[${expression}]+$`, 'g')
	return str.replace(regex, '')
}
