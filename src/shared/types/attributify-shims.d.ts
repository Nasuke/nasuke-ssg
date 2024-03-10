import type { AttributifyAttributes } from 'unocss/preset-attributify'

declare module 'react' {
  // {}可以定义额外的属性或方法
  interface HTMLAttributes<T> extends AttributifyAttributes{}
}
