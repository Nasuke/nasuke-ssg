import { presetAttributify, presetIcons, presetWind } from "unocss";
import { VitePluginConfig } from "unocss/vite";

const options: VitePluginConfig = {
  presets: [presetAttributify(), presetWind(), presetIcons()],
  shortcuts: {
    'flex-center': 'flex justify-center items-center'
  },
  rules: [
    // 给下划线样式增加自定义rules 通过函数来配置
    [
      /^divider-(\w+)$/, 
      ([,w]) => ({
        [`border-${w}`]: '1px solid var(--nasuke-c-divider-light)'
      })
    ],
    [
      "menu-item-before",
      {
        "margin-right": "12px",
        "margin-left": "12px",
        width: "1px",
        height: "24px",
        "background-color": "var(--nasuke-c-divider-light)",
        content: '" "',
      }
    ]
  ],
  theme: {
    colors: {
      brandLight: 'var(--nasuke-c-brand-light)',
      brandDark: 'var(--nasuke-c-brand-dark)',
      brand: 'var(--nasuke-c-brand)',
      text: {
        1: 'var(--nasuke-c-text-1)',
        2: 'var(--nasuke-c-text-2)',
        3: 'var(--nasuke-c-text-3)',
        4: 'var(--nasuke-c-text-4)'
      },
      divider: {
        default: 'var(--nasuke-c-divider)',
        light: 'var(--nasuke-c-divider-light)',
        dark: 'var(--nasuke-c-divider-dark)'
      },
      gray: {
        light: {
          1: 'var(--nasuke-c-gray-light-1)',
          2: 'var(--nasuke-c-gray-light-2)',
          3: 'var(--nasuke-c-gray-light-3)',
          4: 'var(--nasuke-c-gray-light-4)'
        }
      },
      bg: {
        default: 'var(--nasuke-c-bg)',
        soft: 'var(--nasuke-c-bg-soft)',
        mute: 'var(--nasuke-c-bg-mute)'
      }
    }
  }
}

export default options
