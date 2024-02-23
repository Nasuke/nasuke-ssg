import { createServer as createViteServer } from 'vite';
import { pluginIndexHtml } from './plugin-nasuke/indexHtml';
import pluginReact from '@vitejs/plugin-react';

export async function createDevServer(root = process.cwd()) {
  return createViteServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  });
}
