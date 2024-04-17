import { usePageData } from '@runtime';
import { HomeHero } from '../../components/HomeHero/index';
import { HomeFeature } from '../../components/HomeFeature/index';
import { useFront } from '../../logic/useFront';

export function HomeLayout() {
  const { frontmatter: front } = usePageData();
  const frontmatter = useFront(front);
  return (
    <div>
      <HomeHero hero={frontmatter.hero} />
      <HomeFeature features={frontmatter.features} />
    </div>
  );
}
