"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginIndexHtml = void 0;
const promises_1 = require("fs/promises");
const constants_1 = require("../constants");
// 返回一个对象
function pluginIndexHtml() {
    return {
        name: "index-html",
        // 只用于开发环境
        apply: "serve",
        // 该钩子用于控制html内容 - 请求响应阶段执行
        transformIndexHtml(html) {
            return {
                html,
                // 注入标签
                tags: [
                    {
                        tag: "script",
                        attrs: {
                            type: "module",
                            src: `/@fs/${constants_1.CLIENT_ENTRY_PATH}` // 绝对路径
                        },
                        injectTo: "body"
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
                    let html = await (0, promises_1.readFile)(constants_1.DEFAULT_HTML_PATH, "utf8");
                    try {
                        html = await server.transformIndexHtml(req.url, html, req.originalUrl);
                        res.setHeader("Content-Type", "text/html");
                        res.end(html);
                    }
                    catch (e) {
                        return next(e);
                    }
                });
            };
        }
    };
}
exports.pluginIndexHtml = pluginIndexHtml;
