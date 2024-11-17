import { moduleNameMapper } from './test.util'

const SRC_PATH = '<rootDir>'

module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['src/modules/**/*.service.ts'],
	coverageDirectory: './coverage',
	testEnvironment: 'node',
	roots: [SRC_PATH],
	moduleNameMapper: moduleNameMapper(SRC_PATH),
	coverageReporters: ['html', 'text'],
	coverageThreshold: {
		global: {
			statements: 90,
			branches: 95,
			functions: 75,
			lines: 90,
		},
	},
}
