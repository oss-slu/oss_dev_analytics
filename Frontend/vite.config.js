import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/oss_dev_analytics/',
  
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  server: {
    fs: {
      allow: [
        new URL('..', import.meta.url).pathname,
      ],
    },
  }
});