import { SiteConfig } from '../../shared/types/index';
import { Plugin } from 'vite';

const SITE_DATA_ID = "nasuke:site-data"


export function PluginConfig(
  config: SiteConfig,
): Plugin{
  return {
    name: 'nasuke: config',
    resolveId(id){
      if(id === SITE_DATA_ID){
        return '\0' + SITE_DATA_ID
      }
    },
    load(id){
      if(id === '\0' + SITE_DATA_ID){
        return `export default ${JSON.stringify(config.siteData)}`
      }
    }
  }
}
