import { useRoutes } from 'react-router-dom';
import { routes } from 'nasuke:routes';

export const Content = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};
