import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // This tells Vite/esbuild to support modern features like top-level await
    target: 'esnext' 
  },
  esbuild: {
    // Also set the target for the minifier/transpiler
    target: 'esnext'
  },
  optimizeDeps: {
    esbuildOptions: {
      // Ensure top-level await works during development/pre-bundling
      target: 'esnext'
    }
  }
})