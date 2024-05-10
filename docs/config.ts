
import { defineConfig } from '../dist';

export default defineConfig({
  title: 'Nasuke',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'AI专栏', link: '/aigc/' },
      // { text: '测试', link: '/test/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          items: [
            {
              text: 'MPA VS SPA',
              link: '/guide/a'
            },
            {
              text: 'Island架构',
              link: '/guide/island'
            },
            {
              text: '资源处理',
              link: '/guide/b'
            },
            {
              text: 'Vite插件系统',
              link: '/guide/c'
            },
         ]
        },
        {
          text: '基础功能',
          items: [
            {
              text: '约定式路由',
              link: '/guide/route'
            },
            {
              text: '配置解析器',
              link: '/guide/b'
            },
            {
              text: 'MDX语法',
              link: '/guide/use-mdx'
            },
            {
              text: '开发阶段热更新',
              link: '/guide/b'
            },
         ]
        },
        {
          text: '默认主题',
          items:[
            {
              text: '配置文件',
              link: '/guide/configure-site'
            },
            {
              text: '首页配置',
              link: '/guide/home-page'
            },
            {
              text: '导航栏配置',
              link: '/guide/navbar'
            },
          ]
        },
        {
          text: '更进一步',
          items:[
            {
              text: '拓展扩建',
              link: '/guide/extension'
            }
          ]
        }
      ],
      '/aigc/':[
        {
          text: "mysql连接相关",
          items: [
            {
              text: 'idea连接mysql数据库常见问题',
              link: '/aigc/1'
            },
            {
              text: 'idea登录问题',
              link: '/aigc/2'
            },
            {
              text: 'idea连接问题',
              link: '/aigc/3'
            },
            {
              text: '深度排查连接错误',
              link: '/aigc/4'
            },
            {
              text: '加速MySQL连接速度',
              link: '/aigc/5'
            },
            {
              text: 'SSH隧道连',
              link: '/aigc/6'
            },
          ]
        },
        {
          text: "mysql基础知识及常见问题",
          items:[
            {
              text: '初探数据库魔法操作',
              link:'/aigc/11'
            },
            {
              text: 'MySQL数据库创建常见误区',
              link:'/aigc/22'
            },
            {
              text: '数据类型选择技巧',
              link:'/aigc/33'
            },
            {
              text: 'MySQL索引创造法宝',
              link:'/aigc/44'
            },
            {
              text: 'MySQL表结构设计陷阱',
              link:'/aigc/55'
            },
            {
              text: '完美数据约束与完整性',
              link:'/aigc/66'
            },
          ]
        },
        {
          text: 'Linux相关',
          items:[
            {
              text: 'Linux内核漏洞开发修复',
              link: '/aigc/1a'
            }
          ]
        },
        {
          text: '人工智能相关',
          items:[
            {
              text: '文本生成介绍',
              link: '/aigc/2a'
            }
          ]
        },
        
      ]
    }
  },
  description: '基于Vite的静态网站生成器'
});
