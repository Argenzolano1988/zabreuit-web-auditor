import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node20',
  platform: 'node',
  bundle: true,
  clean: true,
  minify: false,
  noExternal: [/@zabreuit\/core/],
  external: ['got-scraping', 'apify', 'crawlee'],
  outExtension() {
    return {
      js: '.js',
    };
  },
});
