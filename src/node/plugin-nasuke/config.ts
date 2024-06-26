import { join, relative } from 'path';
import { SiteConfig } from '../../shared/types/index';
import { Plugin, normalizePath } from 'vite';
import { PACKAGE_ROOT } from 'node/constants';
import fs from 'fs-extra';
import sirv from 'sirv';

const SITE_DATA_ID = 'nasuke:site-data';

export function PluginConfig(
  config: SiteConfig,
  restart?: () => Promise<void>
): Plugin {
  return {
    name: 'nasuke: config',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            '@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts')
          }
        },
        optimizeDeps: {
          include: [
            'react',
            'react-dom',
            'react-dom/client',
            'react-router-dom',
            'react/jsx-runtime',
            'react-helmet-async',
            'lodash-es'
          ]
        },
        // modules里面默认使用驼峰
        css: {
          modules: {
            localsConvention: 'camelCaseOnly'
          }
        }
      };
    },
    async handleHotUpdate(ctx) {
      // 配置文件路径
      const customFilesPath = [normalizePath(config.configPath)];
      // 匹配
      const include = (id: string) =>
        customFilesPath.some((file) => id.includes(file));
      // ctx.file代表需要热更的文件
      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server`
        );
        // 重启Dev Server
        // 1- 利用configureServer获取到server实例调用restart  缺点: 不会读取新的配置
        // 2- dev.ts中重启
        await restart();
      }
    },
    configureServer(server) {
      //
      const publicDir = join(config.root, 'public');
      // 增加静态资源处理中间件
      if (fs.pathExistsSync(publicDir)) {
        server.middlewares.use(sirv(publicDir));
      }
    }
  };
}
