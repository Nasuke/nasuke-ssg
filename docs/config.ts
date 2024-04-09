import { defineConfig } from '../dist';

export default defineConfig({
  title: 'Nasuke',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '指南', link: '/guide/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '教程',
          items: [
            {
              text: 'MPA VS SPA',
              link: '/guide/a'
            },
            {
              text: 'MDX',
              link: '/guide/b'
            },
           {
             text: 'normal',
             link: '/guide/Counter'
           },
           {
            text: 'vite',
            link: '/guide/c'
           },
           {
            text: 'test',
            link: '/guide/d'
           }
         ]
        }
      ]
    }
  }
});
