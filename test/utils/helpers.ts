type SortType = 'asc' | 'desc'

export const isSorted = (data: Array<any>, key: string, type: SortType) =>
	data.every((item, index) => {
		if (index === 0) return true
		if (type === 'asc' && item[key] >= data[index - 1][key]) return true
		if (item[key] <= data[index - 1][key]) return true
	})

export const toJSON = (data: any) => JSON.parse(JSON.stringify(data))
