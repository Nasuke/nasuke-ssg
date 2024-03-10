import { presetAttributify, presetIcons, presetWind } from "unocss";
import { VitePluginConfig } from "unocss/vite";

const options: VitePluginConfig = {
  presets: [presetAttributify(), presetWind(), presetIcons()]
}

export default options
