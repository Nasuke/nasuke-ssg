import { join } from 'path';

// 根路径
export const PACKAGE_ROOT = join(__dirname, '..');
// 模版
export const DEFAULT_HTML_PATH = join(PACKAGE_ROOT, 'template.html');
// client入口路径
export const CLIENT_ENTRY_PATH = join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'client-entry.tsx'
);
// server入口路径
export const SERVER_ENTRY_PATH = join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'server-entry.tsx'
);
// 匹配mdx文件
export const MD_REGEX = /\.mdx?$/;

export const MASK_SPLITTER = '!!ISLAND!!';
