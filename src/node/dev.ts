import { createServer as createViteServer } from 'vite';
import { pluginIndexHtml } from './plugin-nasuke/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';

export async function createDevServer(root = process.cwd()) {
  return createViteServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT] // 根目录下文件都是合法路径
      }
    }
  });
}
