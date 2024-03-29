import { readFile } from 'fs/promises';
import { Plugin } from 'vite';
import { CLIENT_ENTRY_PATH, DEFAULT_HTML_PATH } from '../constants';

// 返回一个对象
export function pluginIndexHtml(): Plugin {
  return {
    name: 'index-html',
    // 只用于开发环境
    apply: 'serve',
    // 该钩子用于控制html内容 - 请求响应阶段执行
    transformIndexHtml(html) {
      return {
        html,
        // 注入标签
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${CLIENT_ENTRY_PATH}` // 绝对路径
            },
            injectTo: 'body'
          }
        ]
      };
    },
    // 该钩子获取DevServer实例 用于拓展中间件 - 服务启动阶段执行
    configureServer(server) {
      // 在vite内置中间件之后执行
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 读取html - 响应给浏览器
          let html = await readFile(DEFAULT_HTML_PATH, 'utf8');
          try {
            // 利用该方法会额外注入一些script标签 用于热更新
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}
