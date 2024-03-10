import { Plugin } from 'vite'
import { RouteService } from './RouteService';

interface PluginOptions {
  root: string,
  isSSR: boolean
}

export interface Route {
  path: string,
  element: React.ReactElement,
  filePath: string
}

// routes对应虚拟模块id
export const CONVENTIONAL_ROUTE_ID = 'nasuke:routes';

export function pluginRoutes(options: PluginOptions): Plugin{

  const routeService = new RouteService(options.root)

  return {
    name: 'nasuke:routes',
    async configResolved() {
      // Vite 启动时，对 RouteService 进行初始化(该钩子在config之后运行 用于记录最终配置)
      await routeService.init()
    },
    resolveId(id: string) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + id;
      }
    },
    load(id: string) {
      if(id === '\0' + CONVENTIONAL_ROUTE_ID) {
        // 返回构造的模块内容(包含组件懒加载 ssg阶段则不用)
        return routeService.generateRoutesCode(options.isSSR || false)
      }
    }
  }
}
