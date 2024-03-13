import { usePageData } from '@runtime'
import { Nav } from '../components/Nav'
import "../style/base.css"
import "../style/vars.css"
import "../style/doc.css"
import 'uno.css'
import { HomeLayout } from './HomeLayout';
import { DocLayout } from './DocLayout';
import { Helmet } from 'react-helmet-async'



export function Layout() {

  const pageData = usePageData()
  const { pageType, title } = pageData;
  // 根据 pageType 分发不同的页面内容
  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />
    } else if (pageType === 'doc') {
      return <DocLayout />
    } else {
      return <div>404 页面</div>;
    }
  };
  return (
    <div>
      <Nav />
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <section
        style={{
          paddingTop: 'var(--nasuke-nav-height)'
        }}
      >
        {getContent()}
      </section>
    </div>
  );
}
