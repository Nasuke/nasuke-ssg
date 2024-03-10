import fastGlob from 'fast-glob'
import { normalizePath } from 'vite'
import path from 'path'
import { relative } from 'path';

interface RouteMeta {
  routePath: string;
  absolutePath: string;
}

// 构造路由数据
export class RouteService {
  _scanDir: string // 扫描目录
  _routeData: RouteMeta[] = [] // 路由数据
  constructor(scanDir: string){
    this._scanDir = scanDir
  }

  async init(){
    // 抓取后缀符合条件的文件 并排序
    const files = fastGlob.sync(
      ['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        cwd: this._scanDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/build/**', 'config.ts']
      }
    ).sort()

    // 遍历文件路径 构造routeMeta中的数据
    files.map(file => {
      // 构造相对路径
      const fileRelativePath = normalizePath(
        path.relative(this._scanDir, file)
      )
      // 转换为路由路径
      const routePath = this.normalizeRoutePath(fileRelativePath)
      this._routeData.push({
        routePath,
        absolutePath: file
      })
    })

  }

  // 提供一个用法用于获取路由数据
  getRouteMeta(): RouteMeta[]{
    return this._routeData
  }

  // 标准化网页路由路径
  normalizeRoutePath(relativePath: string) {
    // 去掉拓展名 如果以index结尾也去掉 /home/index.html => /home/
    const routePath = relativePath.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }

  // 生成模块代码
  // ssr - 直接从本地获取产物 dev 不需要 loadable
  generateRoutesCode(ssr = false) {
    return `
import React from 'react';
${ssr ? '' : 'import loadable from "@loadable/component";'}

${this._routeData
  .map((route, index) => {
    return ssr
      ? `import Route${index} from "${route.absolutePath}";`
      : `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
  })
.join('\n')}
  
export const routes = [
  ${this._routeData
    .map((route, index) => {
      return `{ path: '${route.routePath}', element: React.createElement(Route${index}) }`;
    })
    .join(',\n')}
  ];
  `;
  }
}
