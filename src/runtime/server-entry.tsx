import { App } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server'

// compoent render for ssr
export function render() {
  return renderToString(
    <StaticRouter location={'/guide'}>
      <App />
    </StaticRouter>
  );
}
