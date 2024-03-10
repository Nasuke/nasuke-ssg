import type { Plugin } from 'unified';
import Slugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { Root } from 'mdast';
// MdxjsEsm 表示 MDX 中嵌入的 ESM 导入/导出。它可以用在需要流动内容的地方。其内容由其 value 字段表示
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import type {Program} from 'estree-jsx'
import { parse } from 'acorn';

const slugger = new Slugger()



interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface ChildNode {
  type: 'link' | 'text' | 'inlineCode';
  value: string;
  children?: ChildNode[]
}


export const remarkPluginToc:Plugin<[], Root> = () => {
  return (tree) => {
    const toc:TocItem[] = []
    visit(tree, 'heading', (node) => {
      // boundary case
      if(!node.depth || !node.children) {
        return
      }
      // h2 ~ h4
      if(node.depth > 1 && node.depth < 5) {
        const originText = (node.children as ChildNode[])
        .map(child => {
          switch(child.type){
            // link节点无value 需要从children中拿
            case 'link':
              return child.children?.map(c => c.value).join('') || '';
            default:
              return child.value
          }
        })
        .join('')
        // 对标题文本规范化
        const id = slugger.slug(originText)
        toc.push({
          id,
          text: originText,
          depth: node.depth
        })
      }
    })

    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)};`;
    // 相关文档 https://github.com/syntax-tree/mdast-util-mdxjs-esm
    tree.children.push({
      type: 'mdxjsEsm',
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: 'module'
        }) as unknown as Program
      }
    } as MdxjsEsm)
  }
}

// node.children 是一个数组，包含几种情况:
// 1. 文本节点，如 '## title'
// 结构如下:
// {
//   type: 'text',
//   value: 'title'
// }
// 2. 链接节点，如 '## [title](/path)'
// 结构如下:
// {
//   type: 'link',
//   children: [
//     {
//       type: 'text',
//       value: 'title'
//     }
//   ]
// }
// 3. 内联代码节点，如 '## `title`'
// 结构如下:
// {
//   type: 'inlineCode',
//   value: 'title'
// }
