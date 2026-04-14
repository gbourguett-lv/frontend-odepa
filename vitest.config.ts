import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['app/**/*.{ts,tsx}'],
      exclude: [
        'app/root.tsx',
        'app/routes.ts',
        '**/*.d.ts',
        '**/node_modules/**',
      ],
    },
  },
});
