import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useLoginStore } from '../../model';

function QiankunRouterShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastPathRef = useRef(location.pathname);

  const token = useLoginStore(state => state.token);
  const currentModulePath = useLoginStore(state => state.currentModulePath);
  const subRouteIntercept = useLoginStore(state => state.subRouteIntercept);
  const setSubRouteIntercept = useLoginStore(state => state.setSubRouteIntercept);

  useEffect(() => {
    let active = true;

    const redirectToLogin = () => {
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    };

    const runGuard = async () => {
      if (!token) {
        redirectToLogin();
        lastPathRef.current = location.pathname;
        return;
      }

      if (location.pathname === '/login') {
        navigate(currentModulePath || '/', { replace: true });
        lastPathRef.current = location.pathname;
        return;
      }

      if (subRouteIntercept.isIntercept && subRouteIntercept.callback) {
        let isSkip = false;
        try {
          isSkip = await subRouteIntercept.callback();
        }
        catch (error) {
          console.error('[qiankun] sub route intercept callback failed', error);
        }

        if (!active) return;

        if (isSkip) {
          if (typeof window.setQianKunGlobalState === 'function') {
            window.setQianKunGlobalState({
              isInterceptRoute: false,
              interceptRouteCallback: null,
            });
          }

          setSubRouteIntercept({
            isIntercept: false,
            callback: null,
          });
          lastPathRef.current = location.pathname;
          return;
        }

        navigate(lastPathRef.current || currentModulePath || '/', { replace: true });
        return;
      }

      if (location.pathname === '/' && currentModulePath) {
        navigate(currentModulePath, { replace: true });
        lastPathRef.current = currentModulePath;
        return;
      }

      lastPathRef.current = location.pathname;
    };

    void runGuard();

    return () => {
      active = false;
    };
  }, [
    token,
    location.pathname,
    currentModulePath,
    subRouteIntercept,
    navigate,
    setSubRouteIntercept,
  ]);

  return <Outlet />;
}

export default QiankunRouterShell;
