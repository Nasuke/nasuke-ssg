import { createRoot } from 'react-dom/client';
import { App } from './App';

import { BrowserRouter } from 'react-router-dom'

// 该字符串是虚拟模块的id 通过插件去匹配该id去做对应处理
import siteData from 'nasuke:site-data'

function renderInBrowser() {
  console.log(siteData);
  
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  createRoot(containerEl).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

renderInBrowser();
