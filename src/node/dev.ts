import { createServer as createViteServer } from 'vite';
import { pluginIndexHtml } from './plugin-nasuke/indexHtml';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';

import pluginReact from '@vitejs/plugin-react';
import { PluginConfig } from './plugin-nasuke/config';

export async function createDevServer(root = process.cwd()) {

  // 获取配置文件
  const config = await resolveConfig(root, 'serve', 'development')
  console.log(config);
  
  return createViteServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact(), PluginConfig(config)],
    server: {
      fs: {
        allow: [PACKAGE_ROOT] // 根目录下文件都是合法路径
      }
    }
  });
}
