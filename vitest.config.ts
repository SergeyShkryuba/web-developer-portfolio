import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@app': resolve(import.meta.dirname, 'src/app'),
      '@widgets': resolve(import.meta.dirname, 'src/widgets'),
      '@features': resolve(import.meta.dirname, 'src/features'),
      '@entities': resolve(import.meta.dirname, 'src/entities'),
      '@shared': resolve(import.meta.dirname, 'src/shared'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
});
