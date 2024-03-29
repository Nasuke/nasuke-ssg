import { createServer as createViteServer } from 'vite';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { createVitePlugins } from './vitePlugin';

export async function createDevServer(
  root = process.cwd(), 
  restart: () => Promise<void>) {

  // 获取配置文件
  const config = await resolveConfig(root, 'serve', 'development')
  console.log(config);
  
  return createViteServer({
    root: PACKAGE_ROOT, // 直接接受用户的docs目录 会先被vite接管 直接返回文件内容了 与约定式路由冲突
    plugins: await createVitePlugins(config, restart),
    server: {
      fs: {
        allow: [PACKAGE_ROOT] // 根目录下文件都是合法路径
      }
    }
  });
}
