import { defineConfig } from 'vitest/config'
import {loadEnv} from 'vite';
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: loadEnv('', process.cwd(), ''),
    retry: 2,
    testTimeout: 30000,
    hookTimeout: 30000
  }
})
