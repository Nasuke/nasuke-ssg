import shiki from 'shiki'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Text } from 'hast'
import { fromHtml } from 'hast-util-from-html'


interface Options {
  highlighter: shiki.Highlighter
}

export const rehypePluginShiki:Plugin<[Options], Root> = ({highlighter}) => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // <pre><code>...</code></pre>
      if (
        node.tagName === 'pre' && 
        node.children[0]?.type === 'element' &&
        node.children[0]?.tagName === 'code'
      ) {
        const codeNode = node.children[0]
        const codeContent = (codeNode.children[0] as Text).value
        const codeClassName = codeNode.properties?.className?.toString() || ''

        const lang = codeClassName.split('-')[1]
        if (!lang) {
          return
        }
        // 高亮结果
        const highlightedCode = highlighter.codeToHtml(codeContent, {lang})
        // 转换成AST后插入语法树
        const fragmentAst = fromHtml(highlightedCode, {fragment: true})
        parent.children.splice(index, 1, ...fragmentAst.children)
      }
    })
  }
}
