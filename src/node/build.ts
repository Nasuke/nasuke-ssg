import { InlineConfig, build as ViteBuild, normalizePath } from 'vite';
import type { RollupOutput } from 'rollup';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { dirname, join } from 'path';
import fs from 'fs-extra';



import { pathToFileURL } from 'url';
import { SiteConfig } from 'shared/types';
import { createVitePlugins } from './vitePlugin';
import { Route } from './plugin-routes';



export async function bundle(root: string, config: SiteConfig) {
  // 抽离公共配置
  const resolveViteConfig = async (isServer: boolean): Promise<InlineConfig> => ({
    mode: 'production',
    root,
    ssr: {
      noExternal: ['react-router-dom']
    },
    // 创建插件
    plugins: await createVitePlugins(config, undefined, isServer),
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
      ViteBuild(await resolveViteConfig(false)),
      // server
      ViteBuild(await resolveViteConfig(true))
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
  // 拿到render函数即路由数据
  const { render, routes } = await import(
    pathToFileURL(serverBundleEntryPath).toString()
  );

  // 渲染出html 写入
  await renderPage(render, routes, root, clientBundle);
}

export async function renderPage(render,routes: Route[], root, clientBundle) {
  // clientChunk for hydration
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  console.log('Rendering page in server side');

  // 针对每个路由生成对应的HTML内容 并写入磁盘
  await Promise.all(
    routes.map(async (route) => {
      const routePath = route.path
      const appHtml = render(routePath)
      // 借用render方法将组件渲染成html 插入模版
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
      // 处理写入的文件后缀
      const fileName = routePath.endsWith('/')
          ? `${routePath}index.html`
          : `${routePath}html`
      // 写入前确保文件存在
      await fs.ensureDir(normalizePath(join(root, 'build', dirname(fileName))))
      await fs.writeFile(normalizePath(join(root, 'build', fileName)), html)
    })
  )
  await fs.remove(normalizePath(join(root, '.temp')))

  // remove server bundle

}
