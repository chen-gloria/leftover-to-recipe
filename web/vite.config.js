import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // When running `vite` (not `vercel dev`) against a separately-running
      // `vercel dev` API server, uncomment and point this at its port:
      // '/api': 'http://localhost:3000'
    }
  }
});
