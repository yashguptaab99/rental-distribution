/* eslint-disable @typescript-eslint/no-var-requires */
exports.moduleNameMapper = (srcPath) => {
	// Get paths from tsconfig
	const TS_CONFIG_PATH = './tsconfig.json'
	const { paths } = require(TS_CONFIG_PATH).compilerOptions

	const aliases = {}

	// Iterate over paths and convert them into moduleNameMapper format
	Object.keys(paths).forEach((item) => {
		const key = item.replace('/*', '/(.*)')
		const path = paths[item][0].replace('/*', '/$1')
		aliases[key] = srcPath + '/' + path
	})
	return aliases
}
