/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/infrastructure/__tests__/setup.tsx'],
    include: ['src/**/*.test.*'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/*.d.ts',
    ],
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/infrastructure/__tests__/',
        '**/*.d.ts',
        '**/*.test.*',
        '**/coverage/**',
      ],
    },
  },
})
