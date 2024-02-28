import { InlineConfig, build as ViteBuild } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import type { RollupOutput } from 'rollup';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { join } from 'path';
import fs from 'fs-extra';



import { pathToFileURL } from 'url';
import { SiteConfig } from 'shared/types';
import { PluginConfig } from './plugin-nasuke/config';

export async function bundle(root: string, config: SiteConfig) {
  // 抽离公共配置
  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    mode: 'production',
    root,
    ssr: {
      noExternal: ['react-router-dom']
    },
    // 自动注入react插件
    plugins: [pluginReact(), PluginConfig(config)],
    build: {
      ssr: isServer,
      outDir: isServer ? join(root, '.temp') : join(root, 'build'),
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm'
        }
      }
    }
  });

  // 并发打包
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      // client
      ViteBuild(resolveViteConfig(false)),
      // server
      ViteBuild(resolveViteConfig(true))
    ]);
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {
    console.log(error);
  }
}

console.log('Building client + server bundles...');

export async function build(root: string = process.cwd(), config: SiteConfig) {
  const [clientBundle] = await bundle(root, config);
  // 引入 ssr 入口模块
  const serverBundleEntryPath = join(root, '.temp', 'server-entry.js');
  // 兼容windows处理 需要使用pathToFileURL
  const { render } = await import(
    pathToFileURL(serverBundleEntryPath).toString()
  );

  // 渲染出html 写入
  await renderPage(render, root, clientBundle);
}

export async function renderPage(render, root, clientBundle) {
  // clientChunk for hydration
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  console.log('Rendering page in server side');
  // compoent html
  const appHtml = render();
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();

  await fs.ensureDir(join(root, 'build'));
  await fs.writeFile(join(root, 'build/index.html'), html);
  // remove server bundle
  await fs.remove(join(root, '.temp'));
}
