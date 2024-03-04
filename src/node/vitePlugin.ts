import { PluginConfig } from "./plugin-nasuke/config";
import { pluginIndexHtml } from "./plugin-nasuke/indexHtml";
import pluginReact from '@vitejs/plugin-react';
import { pluginRoutes } from "./plugin-routes";
import { createPluginMdx } from "./plugin-mdx";
import { SiteConfig } from '../shared/types/index';
import { Plugin } from 'vite'

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>
) {
  return [
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic'
    }),
    PluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root
    }),
    await createPluginMdx()
  ] as Plugin[];
}

