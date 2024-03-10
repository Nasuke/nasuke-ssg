import { PageData } from 'shared/types';
import { Layout } from '../theme-default';
import { matchRoutes } from 'react-router-dom';
import { routes } from 'nasuke:routes';
import siteData from 'nasuke:site-data';
import { Route } from 'node/plugin-routes';


export async function initPageData(routePath:string):Promise<PageData> {
  const matched = matchRoutes(routes, routePath)
  debugger
  // 获取路由组件编译后的模块内容
  if(matched) {
    const matchRoute = matched[0].route as Route
    const moduleInfo = await matchRoute.preload()
    console.log("moduleInfo", moduleInfo);
    return {
      pageType: 'doc',
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath
    }
    
  }
  return {
    pageType: '404',
    siteData,
    pagePath: routePath,
    frontmatter: {}
  }
}

export function App() {
  return <Layout />;
}
