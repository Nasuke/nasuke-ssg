import { App, initPageData } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server'
import { DataContext } from './hooks';

// compoent render for ssr
export async function render(pagePath: string) {
  // 生产 pageData
  const pageData = await initPageData(pagePath)
  return renderToString(
    
    <DataContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
      <App />
    </StaticRouter>
    </DataContext.Provider>
  );
}

// 导出虚拟模块中的路由数据
export { routes } from 'nasuke:routes'
