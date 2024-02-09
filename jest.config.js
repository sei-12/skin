/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: [
    {
      displayName: 'dom',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      testMatch: [
        '**/src/renderer/*.test.ts?(x)',
        '**/src/renderer/sub/*.test.ts?(x)',
      ]
    },
    {
      displayName: 'node',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: [
        '**/src/main/*.test.ts?(x)'
      ]
    },
  ],
};