import { createContext, useContext } from 'react';
import { PageData } from 'shared/types';

export const DataContext = createContext({} as PageData);

// 为前端组件提供数据
export const usePageData = () => {
  return useContext(DataContext);
};
