import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5173 },
  define: {
    global: 'window',       // <-- Решает проблему с global is not defined
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
});
