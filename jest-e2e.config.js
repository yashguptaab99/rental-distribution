/* eslint-disable @typescript-eslint/no-var-requires */
const { moduleNameMapper } = require('./test.util')

const SRC_PATH = '<rootDir>'

module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	testEnvironment: 'node',
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	roots: [SRC_PATH],
	moduleNameMapper: moduleNameMapper(SRC_PATH),
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/resources/',
		'!src/config/**/*.ts',
		'!src/core/**/*.ts',
		'!src/resources/**/*.ts',
		'!src/modules/health/**/*.ts',
		'!src/**/*.spec.ts',
		'!src/*.ts',
		'!src/modules/*.ts',
		'!src/modules/**/*.response.dto.ts',
	],
	coverageReporters: ['html', ['text', { skipFull: true }]],
	coverageThreshold: {
		global: {
			statements: 80,
			branches: 80,
			functions: 80,
			lines: 80,
		},
	},
}
