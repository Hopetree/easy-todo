import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  publicDir: 'src/public',
  manifest: {
    name: 'Easy Todo',
    description: '浏览器插件 TODO 管理器',
    permissions: [],
    icons: {
      16: 'icons/icon16.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
  },
});
