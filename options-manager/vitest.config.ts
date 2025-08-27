import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './jest.setup.jsx',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],

      exclude: [
        'node_modules/',
        '.next/',
        'coverage/',
        'src/test-mocks/',
        'src/types/',
        'src/app/layout.tsx',
        'src/components/ThemeRegistry.tsx',
        'src/theme.ts',
        '**/*.config.{js,ts,cjs}',
        '**/.eslintrc.cjs',
        'jest.setup.jsx',
      ],
    },
  },
})
