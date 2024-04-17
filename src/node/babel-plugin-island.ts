import { declare } from '@babel/helper-plugin-utils';
import type { Visitor } from '@babel/traverse';
import type { PluginPass } from '@babel/core';
import { types as t } from '@babel/core';
import { MASK_SPLITTER } from './constants';
import { normalizePath } from 'vite';

export default declare((api) => {
  // 确保 Babel 版本为7
  api.assertVersion(7);

  const visitor: Visitor<PluginPass> = {
    // <A __island>
    // <A.B __island>
    // JSXOpeningElement 是处理 JSX 元素开始标签的方法。
    // JSXOpeningElement包含了元素的名字以及所有属性
    JSXOpeningElement(path, state) {
      // 获取 JSX 标签名称。
      const name = path.node.name;
      let bindingName = '';
      // 如果标签名是直接的标识符（比如 <MyComponent>），获取其名称。
      if (name.type === 'JSXIdentifier') {
        bindingName = name.name;
      }
      // 如果标签名是成员表达式（比如 <MyNamespace.MyComponent>），
      // 那么需要遍历找到最顶层的对象以获取其名称。
      else if (name.type === 'JSXMemberExpression') {
        let object = name.object;
        // 持续遍历成员表达式的对象，直到找到最外层的 JSX 标识符。
        while (t.isJSXMemberExpression(object)) {
          object = object.object;
        }
        // 获取最外层对象的名称。
        bindingName = object.name;
      } else {
        return;
      }
      // 根据获取的绑定名称在当前作用域中查找对应的绑定（变量声明等）。
      // 作用域包含源码位置 声明方式 是否引用等
      const binding = path.scope.getBinding(bindingName);

      // 如果找到的绑定来自于导入声明（import），则进行特定操作。
      if (binding?.path.parent.type === 'ImportDeclaration') {
        // 获取导入来源的路径。
        const source = binding.path.parent.source;
        // 获取 JSX 元素的所有属性。
        const attributes = (path.container as t.JSXElement).openingElement
          .attributes;

        // 遍历所有属性。
        for (let i = 0; i < attributes.length; i++) {
          // 获取当前属性的名称。
          const name = (attributes[i] as t.JSXAttribute).name;

          // 处理island属性
          if (name?.name === '__island') {
            // 设置 '__island' 属性的值为源路径与文件路径的组合，
            (attributes[i] as t.JSXAttribute).value = t.stringLiteral(
              `${source.value}${MASK_SPLITTER}${normalizePath(
                state.filename || ''
              )}`
            );
          }
        }
      }
    }
  };

  return {
    name: 'transform-jsx-island',
    visitor
  };
});
