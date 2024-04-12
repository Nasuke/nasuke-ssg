import { usePageData, Content } from '@runtime';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/index';
import styles from './index.module.scss';
import { DocFooter } from '../../components/DocFooter/index';
import { Aside } from '../../components/Aside/index';

export function DocLayout() {
  const { siteData, toc } = usePageData();
  const sidebarData = siteData.themeConfig?.sidebar || {};
  // 获取当前路径
  const { pathname } = useLocation();
  const matchedSidebarKey = Object.keys(sidebarData).find((key) => {
    if (pathname.startsWith(key)) {
      return true;
    }
  });

  const matchedSidebar = sidebarData[matchedSidebarKey] || [];

  return (
    <div p="t-0 x-6 b-24 sm:6" className={styles.docLayout}>
      <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
      <div className={styles.content} flex="~ 1 shrink-0" m="x-auto">
        <div m="x-auto" flex="~ col" className="max-w-100%">
          <div
            relative="~"
            m="x-auto"
            p="l-2"
            className={'w-100% md:max-w-712px lg:min-w-640px'}
          >
            <div className="nasuke-doc">
              <Content />
            </div>
            <DocFooter />
          </div>
        </div>
        <div
          relative="~"
          display="none lg:block"
          order="2"
          flex="1"
          p="l-8"
          className="max-w-256px"
        >
          <div className={styles.asideContainer}>
            <div
              flex="~ col"
              p="b-8"
              style={{
                minHeight:
                  'calc(100vh - (var(--island-nav-height-desktop) + 32px))'
              }}
            >
              <Aside headers={toc} __island />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
