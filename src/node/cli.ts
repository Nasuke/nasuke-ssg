import { cac } from 'cac';
import { resolve } from 'path';

import { build } from './build';

// 版本号
const cli = cac('island').version('0.0.1').help();

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {

    const createServer = async () => {
      // dev.ts已经单独打包 顾获取其js产物
      const { createDevServer } = await import('./dev.js')
      const server = await createDevServer(root, async () => {
        // 重启回调 先关闭再启动
        await server.close()
        await createServer()
      })
      // 监听
      await server.listen();
      server.printUrls();
    }

    await createServer()
  });

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    try {
      root = resolve(root);
      await build(root);
    } catch (error) {
      console.log(error);
    }
  });
// 解析参数
cli.parse();
