import { useEffect, useRef } from 'react';
import { Location, useLocation } from 'react-router-dom';
import { AuthContext, signIn, signOut, saveUserInfor } from './context';
import KeepAlive from './KeepAlive';
import { AppDispatch, RootState, TypedUseSelectorHook, useSelector, useDispatch } from '@/stores';

// eslint-disable-next-line no-unused-vars
const useLocationListen = (listener: (location: Location) => void) => {
  const location = useLocation();
  useEffect(() => {
    listener(location);
  }, [location]);
};

const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function useOnceCall(cb: () => any, condition = true) {
  const isCalledRef = useRef(false);

  useEffect(() => {
    if (condition && !isCalledRef.current) {
      isCalledRef.current = true;
      return cb();
    }
  }, [cb, condition]);
}

export {
  useLocationListen,
  KeepAlive,
  AuthContext,
  useAppDispatch,
  useAppSelector,
  signIn,
  signOut,
  saveUserInfor,
  useOnceCall,
};
