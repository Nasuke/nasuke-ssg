import { App } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server'

// compoent render for ssr
export function render(pagePath: string) {
  return renderToString(
    <StaticRouter location={pagePath}>
      <App />
    </StaticRouter>
  );
}

// 导出虚拟模块中的路由数据

export { routes } from 'nasuke:routes'
