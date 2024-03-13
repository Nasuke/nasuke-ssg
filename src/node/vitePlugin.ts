import { PluginConfig } from "./plugin-nasuke/config";
import { pluginIndexHtml } from "./plugin-nasuke/indexHtml";
import { pluginRoutes } from "./plugin-routes";
import { createPluginMdx } from "./plugin-mdx";
import { SiteConfig } from '../shared/types/index';
import { Plugin } from 'vite'
import pluginReact from '@vitejs/plugin-react';
import pluginUnocss from 'unocss/vite'
import unocssOptions from './unocssOptions'
import { join } from "path";
import { PACKAGE_ROOT } from "./constants";
import babelPluginIsland from "./babel-plugin-island";


export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR = false
) {
  return [
    pluginUnocss(unocssOptions),
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic',
      jsxImportSource: isSSR
        ? join(PACKAGE_ROOT, 'src', 'runtime')
        : 'react',
      babel: {
        plugins: [babelPluginIsland]
      }
    }),
    PluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root,
      isSSR
    }),
    await createPluginMdx()
  ] as Plugin[];
}

