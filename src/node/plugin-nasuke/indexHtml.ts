import { readFile } from "fs/promises";
import { Plugin } from "vite";
import { DEFAULT_HTML_PATH } from "../constants";

// 返回一个对象
export function pluginIndexHtml():Plugin{
  return {
    name: "index-html",
    // 只用于开发环境
    apply: "serve", 
    // 该钩子用于拓展中间件
    configureServer(server){
      // 在vite内置中间件之后执行
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 读取html - 响应给浏览器
          try {
            let html = await readFile(DEFAULT_HTML_PATH, "utf8")
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
          } catch (e) {
            return next(e)
          }
        })
      }
    }
  }
}
