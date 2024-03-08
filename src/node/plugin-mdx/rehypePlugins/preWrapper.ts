import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Element, Root } from 'hast'


export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // current <pre><code class="lanuage-js">...</code></pre>
      // 找到pre - 解析出代码块语言名称 - 重新构造Html AST
      if(
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code' &&
        !node.data?.isVisited
      ) {
        // 1. 找到了pre元素 从code里提取出语言
        const codeNode = node.children[0] 
        const codeClassName = codeNode.properties?.className?.toString() || ""
        // lanuage-xxx
        const lang = codeClassName.split('-')[1]
        // 2. 重新构造HTML结构
          // 2.0 构造当前pre节点的克隆节点
        const cloneNode:Element = {
          type: 'element',
          tagName: 'pre',
          children: node.children,
          data: {
            isVisited: true // 避免递归
          }
        }
          // 2.1 替换父元素信息
        node.tagName = 'div'
        node.properties = node.properties || {}
        node.properties.className = codeClassName
          // 2.2 替换子元素 增加span和克隆节点
        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties:{
              className: 'lang'
            },
            children:[
              {
                type: 'text',
                value: lang
              }
            ]
          },
          cloneNode
        ]

      }
    })
  }
}
