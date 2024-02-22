import { App } from './App'
import { renderToString } from 'react-dom/server'

// compoent render for ssr
export function render(){
  return renderToString(<App />)
}
