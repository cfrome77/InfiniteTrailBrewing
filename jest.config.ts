import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/tests/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^lucide-react$': '<rootDir>/node_modules/lucide-react/dist/cjs/lucide-react.js',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
const createConfig = createJestConfig(config);

// @portabletext/to-html ships ESM only. next/jest prepends its own ignore
// patterns, so this has to be applied to the resolved config instead of the
// object above, otherwise the appended pattern is shadowed.
const jestConfig = async () => {
  const resolved = await createConfig();
  return {
    ...resolved,
    transformIgnorePatterns: ['/node_modules/(?!(@portabletext)/)'],
  };
};

export default jestConfig;
