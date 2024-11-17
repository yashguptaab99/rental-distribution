export function enumString(enumObject: Record<string, string>): string {
	return Object.values(enumObject).join('|')
}
