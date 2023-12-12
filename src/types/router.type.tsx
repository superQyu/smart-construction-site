import React from 'react';

export interface MenuItem {
  label: string;
  key?: string;
  path: string;
  filepath: string;
  redirect?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  component?: any;
  isStaticLoad?: boolean;
  // element?: { element: () => Promise<{ [key: string]: any }> };
}

export interface TabMenuItems {
  label: string;
  path: string;
  redirect?: string;
  onClick: () => void;
}

export interface TreeParam {
  spId: number;
  pIdKey: string;
  idKey: string;
  intercept?: (args: TreeNode) => TreeNode;
  [key: string]: any;
}
export interface TreeNode {
  id: number;
  parentId: number;
  params?: TreeParam;
  children?: TreeNode[];
  [key: string]: any;
}
