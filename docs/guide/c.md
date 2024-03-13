在之前的双引擎架构中 了解到**Vite开发阶段会模拟Rollup的行为**<br />**开发阶段Vite插件机制会有自己独有的一部分 并非与rollup完全兼容**<br />**兼容的钩子如下**

- 服务器启动 - `options`和`buildStart`
- 请求响应 - `resolveId``load``transform`
- 服务器关闭 -` buildEnd closeBundle `

---

<a name="ihKgE"></a>

## Vite插件系统中独有的hook

---

<a name="IgZ8a"></a>

### config - 丰富配置

时机: 在用户读取完`vite.config.ts` 拿到用户导出的配置对象后执行`config`钩子<br />可以在其中对配置对象做自定义操作

```typescript
// 返回部分配置（推荐）
const editConfigPlugin = () => ({
  name: 'vite-plugin-modify-config',
  config: () => ({
    alias: {
      react: require.resolve('react')
    }
  })
})

const mutateConfigPlugin = () => ({
  name: 'mutate-config',
  // command 为 `serve`(开发环境) 或者 `build`(生产环境)
  config(config, { command }) {
    // 生产环境中修改 root 参数
    if (command === 'build') {
      config.root = __dirname;
    }
  }
})
```

<a name="dEo2s"></a>

### configResolved - 记录最终配置

用于记录信息以共享

```typescript
const exmaplePlugin = () => {
  let config

  return {
    name: 'read-config',

    configResolved(resolvedConfig) {
      // 记录最终配置
      config = resolvedConfig
    },

    // 在其他钩子中可以访问到配置
    transform(code, id) {
      console.log(config)
    }
  }
}
```

<a name="T9E51"></a>

### configureServer - 获取DevServer实例

用于拓展中间件 可以放到内置中间件之前或者之后执行

```typescript
const myPlugin = () => ({
  name: 'configure-server',
  configureServer(server) {
    // 姿势 1: 在 Vite 内置中间件之前执行
    server.middlewares.use((req, res, next) => {
      // 自定义请求处理逻辑
    })
    // 姿势 2: 在 Vite 内置中间件之后执行 
    return () => {
      server.middlewares.use((req, res, next) => {
        // 自定义请求处理逻辑
      })
    }
  }
})
```

<a name="ROlAF"></a>

### transformIndexHtml - 控制HTML内容

拿到内容进行转换

```typescript
const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        /<title>(.*?)</title>/,
        `<title>换了个标题</title>`
      )
    }
  }
}
// 也可以返回如下的对象结构，一般用于添加某些标签
const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return {
        html,
        // 注入标签
        tags: [
          {
            // 放到 body 末尾，可取值还有`head`|`head-prepend`|`body-prepend`，顾名思义
            injectTo: 'body',
            // 标签属性定义
            attrs: { type: 'module', src: './index.ts' },
            // 标签名
            tag: 'script',
          },
        ],
      }
    }
  }
}
```

<a name="wMJbD"></a>

### handleHotUpdate - 热更新处理

可以拿到热更新相关的上下文 自定义处理

```typescript
const handleHmrPlugin = () => {
  return {
    async handleHotUpdate(ctx) {
      // 需要热更的文件
      console.log(ctx.file)
      // 需要热更的模块，如一个 Vue 单文件会涉及多个模块
      console.log(ctx.modules)
      // 时间戳
      console.log(ctx.timestamp)
      // Vite Dev Server 实例
      console.log(ctx.server)
      // 读取最新的文件内容
      console.log(await read())
      // 自行处理 HMR 事件
      ctx.server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: { a: 1 }
      })
      return []
    }
  }
}

// 前端代码中加入
if (import.meta.hot) {
  import.meta.hot.on('special-update', (data) => {
    // 执行自定义更新
    // { a: 1 }
    console.log(data)
    window.location.reload();
  })
}
```

<a name="diTOe"></a>

## 插件执行顺序

---

![image.png](https://cdn.nlark.com/yuque/0/2023/png/12610297/1701077745248-8628582c-fead-4e1c-a320-5352c9a2b6ea.png#averageHue=%23faf9f8&clientId=uac359372-5618-4&from=paste&height=688&id=u35363d63&originHeight=688&originWidth=1618&originalType=binary&ratio=1&rotation=0&showTitle=false&size=174216&status=done&style=none&taskId=u153c0f68-a03e-4544-acfc-cc3b17cbbd0&title=&width=1618)
<a name="vM7Jl"></a>

## 插件应用位置

环境<br />`apply：string | function`  通过该属性可以决定插件生效环境

```typescript
{
  // 'serve' 表示仅用于开发环境，'build'表示仅用于生产环境
  apply: 'serve'
}
// 配置函数更灵活
apply(config, { command }) {
  // 只用于非 SSR 情况下的生产环境构建
  return command === 'build' && !config.build.ssr
}
```

顺序可以通过`enforce`来控制

```typescript
{
  // 默认为`normal`，可取值还有`pre`和`post`
  enforce: 'pre'
}
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/12610297/1701078038154-1fab4c6f-227e-4d2d-b170-134b0e7c3ecd.png#averageHue=%23f7f4ed&clientId=uac359372-5618-4&from=paste&height=430&id=u369c2109&originHeight=430&originWidth=2746&originalType=binary&ratio=1&rotation=0&showTitle=false&size=223193&status=done&style=none&taskId=u5efcb955-4ad7-4bb7-8211-b7f123b6549&title=&width=2746)
<a name="nxjlk"></a>

## 实战

---

<a name="qw1q2"></a>

### 虚拟模块

虚拟模块是一种很实用的模式 使你可以对使用 ESM 语法的源文件传入一些编译时信息<br />它存在于内存中而非磁盘中<br />**我们可以手写代码字符串来作为模块内容**

```typescript
// vite.config.ts
import virtual from './plugins/virtual-module.ts'

// 配置插件
{
  plugins: [react(), virtual()]
}

// plugins/virtual-module.ts
import { Plugin } from 'vite';

// 虚拟模块名称
const virtualFibModuleId = 'virtual:fib';
// Vite 中约定对于虚拟模块，解析后的路径需要加上`\0`前缀
const resolvedFibVirtualModuleId = '\0' + virtualFibModuleId;

export default function virtualFibModulePlugin(): Plugin {
  let config: ResolvedConfig | null = null;
  return {
    name: 'vite-plugin-virtual-module',
    resolveId(id) {
      if (id === virtualFibModuleId) { 
        return resolvedFibVirtualModuleId;
      }
    },
    load(id) {
      // 加载虚拟模块
      if (id === resolvedFibVirtualModuleId) {
        return 'export default function fib(n) { return n <= 1 ? n : fib(n - 1) + fib(n - 2); }';
      }
    }
  }
}
```

---

<a name="xGYzX"></a>

## Vite热更新

计算机领域有一个热拔插的概念<br />当我们插入U盘时 系统驱动会加载U盘内容 但是不会重启系统<br />HMR概念也是这样 `模块局部更新` + `状态保存`<br />Vite的HMR系统基于元素的ESM模块规范来实现<br />这是HMR API定义

```typescript
interface ImportMeta {
  readonly hot?: {
    readonly data: any
    accept(): void
    accept(cb: (mod: any) => void): void
    accept(dep: string, cb: (mod: any) => void): void
    accept(deps: string[], cb: (mods: any[]) => void): void
    prune(cb: () => void): void
    dispose(cb: (data: any) => void): void
    decline(): void
    invalidate(): void
    on(event: string, cb: (...args: any[]) => void): void
  }
}
```

<a name="odXMa"></a>

### 更新逻辑 `hot.accept`

该方法决定了热更新的边界 **边界即是可以处理事件回调的范围**<br />当前模块可以使用该方法接受模块更新 有三种情况

- 自身模块
- 某个子模块
- 多个子模块

当接受自身更新时 边界在自身 回调函数在自身编写 其它模块没有影响<br />当接受子模块更新时 边界在父模块 即编写回调函数的地方<br />多个子模块同理

```typescript
// 条件守卫 自身
+ if (import.meta.hot) {
+  import.meta.hot.accept((mod) => mod.render())
+ }

// main.ts 单个模块
import { render } from './render';
import './state';
render();
+if (import.meta.hot) {
+  import.meta.hot.accept('./render.ts', (newModule) => {
+    newModule.render();
+  })
+}

// main.ts 多个模块
import { render } from './render';
import { initState } from './state';
render();
initState();
+if (import.meta.hot) {
+  import.meta.hot.accept(['./render.ts', './state.ts'], (modules) => {
+    console.log(modules);
+  })
+}

```

注意这里条件守卫的使用 **该操作是为了生产环境的树摇**
<a name="tMQRS"></a>

### 旧模块销毁处理副作用 `hot.dispose`

---

旧模块销毁 模块更新时可以使用它做一些副作用清除操作 如销毁定时器

```typescript
// state.ts
let timer: number | undefined;
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (timer) {
      clearInterval(timer);
    }
  })
}
export function initState() {
  let count = 0;
  timer = setInterval(() => {
    let countEle = document.getElementById('count');
    countEle!.innerText =  ++count + '';
  }, 1000);
}

```

<a name="eIAE6"></a>

### 共享数据 `hot.data`

---

用于在不同模块实例共享数据

<a name="DWaVS"></a>

## Vite产物构建

![](https://cdn.nlark.com/yuque/0/2023/jpeg/12610297/1701142983497-b80ce66a-9507-4082-a11a-6bd4049d26fa.jpeg)
<a name="ahfpD"></a>

### Vite默认拆包策略

自动CSS分割 一个chunk对应一个css文件

```typescript
.
├── assets
│   ├── Dynamic.3df51f7a.js    // Async Chunk
│   ├── Dynamic.f2cbf023.css   // Async Chunk (CSS)
│   ├── favicon.17e50649.svg   // 静态资源
│   ├── index.1e236845.css     // Initial Chunk (CSS)
│   ├── index.6773c114.js      // Initial Chunk
│   └── vendor.ab4b9e1f.js     // 第三方包产物 Chunk 2.9以后默认不单独打包
└── index.html                 // 入口 HTML
```

基于Rollup`manualChunks`实现应用拆包

- `Async Chunk` 动态的import会变成单独的chunk
- `Initial Chunk`和第三方库代码会打包到一起
- 也可以使用插件来沿用2.8版本之前的分割三方库代码策略

```typescript
// vite.config.js
import { splitVendorChunkPlugin } from 'vite'
export default defineConfig({
  plugins: [splitVendorChunkPlugin()],
})
```

<a name="zoIku"></a>

### 自定义拆包

自定义拆包可以让我们操作更细粒 **提高第三方包产物的缓存命中率**<br />可以通过配置对象或者函数的两种方式

```typescript
// vite.config.ts
{
  build: {
    rollupOptions: {
      output: {
        // manualChunks 配置
        manualChunks: {
          // 将 React 相关库打包成单独的 chunk 中
          'react-vendor': ['react', 'react-dom'],
          // 将 Lodash 库的代码单独打包
          'lodash': ['lodash-es'],
          // 将组件库的代码打包
          'library': ['antd', '@arco-design/web-react'],
        },
      },
    }
  },
}

// 入参为模块id 模块详细信息 返回值为chunk文件名称
manualChunks(id) {
  if (id.includes('antd') || id.includes('@arco-design/web-react')) {
    return 'library';
  }
  if (id.includes('lodash')) {
    return 'lodash';
  }
  if (id.includes('react')) {
    return 'react';
  }
}
```

<a name="K296F"></a>

### 解决循环依赖

图示<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/12610297/1701152438133-cdd8fb53-d011-460f-8b6e-c8aa5da530b1.png#averageHue=%23f8f8f1&clientId=ufbb7c4de-f17a-4&from=paste&height=664&id=u5f2edad1&originHeight=664&originWidth=2404&originalType=binary&ratio=1&rotation=0&showTitle=false&size=169847&status=done&style=none&taskId=udfe81f5d-c5c5-4175-bfe1-1cbdb2b9a8d&title=&width=2404)<br />这会导致报错 `xxx is not a function`<br />因为循环依赖导致后者认为前者已经加载完了 继续执行就会出现问题<br />解决思路

- 确定相关包的入口路径
- `manualChunks`函数中拿到模块详细信息 追溯其引用者 如果命中路径 则模块打包到该路径

```typescript
// 确定 react 相关包的入口路径
const chunkGroups = {
  'react-vendor': [
    require.resolve('react'),
    require.resolve('react-dom')
  ],
};

// Vite 中的 manualChunks 配置
// 根据传入的模块id和getModuleInfo函数，查找是否有循环依赖，并返回对应的分组
function manualChunks(id, { getModuleInfo }) {
  // 遍历所有的分组
  for (const group of Object.keys(chunkGroups)) {
    const deps = chunkGroups[group];
    // 判断模块id是否在node_modules中并且被chunkGroups声明的包所引用
    if (
      id.includes('node_modules') &&
      // 递归向上查找引用者，检查是否命中 chunkGroups 声明的包 
      isDepInclude(id, deps, [], getModuleInfo)
     ) {
      return group; // 返回对应的分组
    }
  }
}

// 缓存对象，用于记录已经验证过的依赖路径
const cache = new Map();

// 判断给定的id是否在依赖路径depPaths中，并检查是否存在循环依赖
function isDepInclude(id, depPaths, importChain, getModuleInfo) {
  const key = `${id}-${depPaths.join('|')}`;
  
  // 出现循环依赖，不考虑单独打包 
  if (importChain.includes(id)) {
    cache.set(key, false);
    return false;
  }
  
  // 验证缓存，如果缓存中已记录该路径，则直接返回结果
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  // 命中依赖列表，说明当前模块是被chunkGroups中声明的包所引用的
  if (depPaths.includes(id)) {
    // 引用链中的文件都记录到缓存中，表示已经验证过的依赖路径
    importChain.forEach(item => cache.set(`${item}-${depPaths.join('|')}`, true));
    return true;
  }
  
  // 获取当前模块的详细信息
  const moduleInfo = getModuleInfo(id);
  
  // 如果模块信息不存在或者importers为空，则直接返回false，表示不是循环依赖
  if (!moduleInfo || !moduleInfo.importers) {
    cache.set(key, false);
    return false;
  }
  
  // 核心逻辑，递归查找上层引用者，看是否存在循环依赖
  const isInclude = moduleInfo.importers.some(
    importer => isDepInclude(importer, depPaths, importChain.concat(id), getModuleInfo)
  );
  
  // 设置缓存，记录当前依赖路径的结果
  cache.set(key, isInclude);
  return isInclude;
}

```

- `moduleInfo.importers`可以拿到模块引用者 针对每个引用者递归操作 从而获取引用链信息
- 尽量使用缓存 第三方包模块数量较多

安装插件

```typescript
pnpm i vite-plugin-chunk-split -D
```

引用

```typescript
// vite.config.ts
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

export default {
  chunkSplitPlugin({
    // 指定拆包策略
    customSplitting: {
      // 1. 支持填包名。`react` 和 `react-dom` 会被打包到一个名为`render-vendor`的 chunk 里面(包括它们的依赖，如 object-assign)
      'react-vendor': ['react', 'react-dom'],
      // 2. 支持填正则表达式。src 中 components 和 utils 下的所有文件被会被打包为`component-util`的 chunk 中
      'components-util': [/src\/components/, /src\/utils/]
    }
  })
}
```

---

<a name="CtVuu"></a>

## ssr

![](https://cdn.nlark.com/yuque/0/2024/jpeg/12610297/1705386969796-1110d194-86a5-4e37-b7ed-0c8d7be1211f.jpeg)
