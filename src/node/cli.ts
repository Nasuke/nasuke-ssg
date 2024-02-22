import { cac } from 'cac'
import { createDevServer } from './dev'
import path = require('path');
import { build } from './build';

// 版本号 
const version = require("../../package.json").version

const cli = cac("nasuke").version(version).help()

cli
  .command("[root]", "start dev server")
  .alias("dev")
  .action(async (root: string) => {
    // 命令对应根目录 没有则使用项目根目录
    root = root ? path.resolve(root) : process.cwd()
            
    const server = await createDevServer(root)
    // 监听
    await server.listen()
    server.printUrls()
  });

cli
  .command("build [root]", "build for production")
  .action(async (root: string) => {
    try {
      root = path.resolve(root)
      await build(root)
    } catch (error) {
      console.log(error);
      
    }
  });
// 解析参数
cli.parse();


