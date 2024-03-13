/// <reference types="vite/client" />

declare module 'nasuke:site-data' {
  import type { UserConfig } from 'shared/types';
  const siteData: UserConfig;
  export default siteData;
}


declare module 'nasuke:routes' {
  import type { Route } from 'node/plugin-routes';
  export const routes: Route[];
}
