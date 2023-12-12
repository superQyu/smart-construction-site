import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import type { MenuItem } from '@/types/router.type';
import ErrorPage from '@/components/ErrorPage';

function pathToLazyComponent(Ele: any) {
  if (!Ele) {
    return <ErrorPage>{`[${Ele}] :: Cannot find the path, please configure the correct folder path`}</ErrorPage>;
  }

  const Components = lazy(Ele);
  return (
    <Suspense fallback={<CircularProgress size={20} />}>
      <Components />
    </Suspense>
  );
}

export const filepathToElement = (list: MenuItem[] = []): any[] => {
  return list.map((item) => {
    const transformedItem: any = {
      key: item.key || item.path,
      label: item.label,
      path: item.path,
      element: item.isStaticLoad ? item.component : pathToLazyComponent(item.component),
    };

    if (item.children) {
      const childrenItems = filepathToElement(item.children);
      const redirectIndex = Number(item.redirect);
      transformedItem.children = [
        {
          path: '',
          element: <Navigate to={childrenItems[redirectIndex].path} />,
        },
        ...childrenItems,
      ];
    }
    return transformedItem;
  });
};
