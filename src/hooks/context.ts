import React, { Dispatch } from 'react';
import { setUserToken, setUserInfor } from '@/stores';

import { setToken, removeToken } from '@/utils/tokens';

interface AuthContextType {
  signIn: (dispatch: Dispatch<any>, token: string, values: string) => Promise<unknown>;
  saveUserInfor: (dispatch: Dispatch<any>, values: any) => Promise<unknown>;
  signOut: (dispatch: Dispatch<any>, token: string,) => Promise<unknown>;
  BaseConf: Object;
  MountedApis: Object;
}
// 用户登录
export const signIn = async (dispatch: any, token: string, values: string) => {
  setToken(token, values);
  dispatch(setUserToken(values));
};
// 保存用户信息
export const saveUserInfor = async (dispatch: any, values: any) => {
  dispatch(setUserInfor(values));
};

// 退出
export const signOut = (dispatch: any, token: string,) => {
  return new Promise((resolve) => {
    try {
      removeToken(token);
      dispatch(setUserToken(''));
      dispatch(setUserInfor(''));
    } finally {
      resolve('');
    }
  });
};

export const AuthContext = React.createContext<AuthContextType>({
  signIn,//登录
  saveUserInfor,// 保存用户信息
  signOut,// 退出
  BaseConf: Object,// 基础参数配置
  MountedApis: Object,// 自动化接口
});
