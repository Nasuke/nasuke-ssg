import { presetAttributify, presetIcons, presetWind } from "unocss";
import { VitePluginConfig } from "unocss/vite";

const options: VitePluginConfig = {
  presets: [presetAttributify(), presetWind(), presetIcons()],
  rules: [
    // 给下划线样式增加自定义rules 通过函数来配置
    [
      /^divider-(\w+)$/, 
      ([,w]) => ({
        [`border-${w}`]: '1px solid var(--nasuke-c-divider-light)'
      })
    ]
  ]
}

export default options
