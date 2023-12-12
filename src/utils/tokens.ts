// cookies 相关操作
import Cookies from 'js-cookie';

export function setToken(key: string, value: string | '') {
    return Cookies.set(key, value)
  }
  
  // getToken("键")
  export function getToken(key: string) {
    return  Cookies.get(key);
  }
  
  // removeToken("键")
  export function removeToken(key: string) {
    return Cookies.remove(key);
  }