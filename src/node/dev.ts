import { createServer as createViteServer, createServer } from 'vite';
import { pluginIndexHtml } from './plugin-nasuke/indexHtml';

export async function createDevServer(root = process.cwd()) {
  return createViteServer({
    root,
    plugins: [pluginIndexHtml()]
  })
}
