import { defineConfig } from '../dist'

export default defineConfig({
  title: 'nasuke',
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" }
    ]
  }
})
