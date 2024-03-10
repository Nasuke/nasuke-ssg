import { MD_REGEX } from '../constants'
import { Plugin } from 'vite'
import assert from 'assert'



export function pluginMdxHMR(): Plugin {
  let viteReactPlugin:Plugin;

  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve',
    configResolved(config) {
      // 获取vite处理react热更新插件
      viteReactPlugin = config.plugins.find(
        plugin => plugin.name === 'vite:react-babel'
        ) as Plugin
    },
    async transform(code, id, opts) {
      if(MD_REGEX.test(id)) {

        // 断言成函数 否则调用call会出错
        assert(typeof viteReactPlugin.transform === 'function');
        // 特殊处理id后才能识别
        const result = await viteReactPlugin.transform?.call(
          this,
          code,
          id + '?.jsx',
          opts
        );
        const selfAcceptCode = 'import.meta.hot.accept();';
        if (
          typeof result === 'object' &&
          !result!.code?.includes(selfAcceptCode)
        ) {
          result!.code += selfAcceptCode;
        }
        return result;
      }
    }
  }
}
