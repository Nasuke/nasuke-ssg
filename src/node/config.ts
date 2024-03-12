import { fstat } from "fs"
import { resolve } from "path"
import fs from 'fs-extra';
import { loadConfigFromFile } from "vite";
import { SiteConfig, UserConfig } from 'shared/types/index';


type RawConfig = 
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>)



// 获取配置文件路径
function getUserConfigPath(root: string) {
  try {
    // 仅支持该两种形式的文件
    const supportFileTypes = ['config.ts', 'config.js']
    const configPath = supportFileTypes
      .map(file => resolve(root, file))
      .find(fs.pathExistsSync)
    return configPath
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e
    
  }
}

/**
 * @param {string} root 根路径 用于解析配置文件路径
 * @param {('serve' | 'build')} command 用于透传到解析函数 ConfigEnv
 * @param {('development' | 'production')} mode 用于透传到解析函数 ConfigEnv
 */
export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode)

  // 最终配置
  const siteConfig:SiteConfig = {
    root,
    configPath,
    siteData: resolveSiteConfig(userConfig as UserConfig)
  }

  return siteConfig
}

// 用户配置
export async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  // 1. 获取配置文件路径 js | ts
  const configPath = getUserConfigPath(root)
  // 2. 读取配置文件的内容
  const result = await loadConfigFromFile({
    command, mode
  }, configPath, root)

  if(result){
    // 有三种结果 1-obj 2-promise 3-fun 
    const { config: rawConfig = {} as RawConfig } = result
    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig
    )
    return [configPath, userConfig] as const
  } else {
    return [configPath, {} as UserConfig] as const
  }
}

// 网站配置
export function resolveSiteConfig(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'Nasuke.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  }
}

// 编写配置文件时提供类型提示
export function defineConfig(config: UserConfig): UserConfig{
  return config
}


