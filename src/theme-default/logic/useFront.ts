import { useState, useEffect } from 'react';
import { FrontMatter } from '../../shared/types/index';

export function useFront(initFront: FrontMatter) {
  const [front, setFront] = useState(initFront);

  useEffect(() => {
    if (import.meta.env.DEV) {
      // 监听 mdx 文件变化
      import.meta.hot.on(
        'mdx-changed',
        ({ filePath }: { filePath: string }) => {
          // 拉取最新模块内容 带上时间戳为了防止缓存
          import(/* @vite-ignore */ `${filePath}?import&t=${Date.now()}`).then(
            (module) => {
              setFront(module.frontmatter);
            }
          );
        }
      );
    }
  });
  return front;
}
