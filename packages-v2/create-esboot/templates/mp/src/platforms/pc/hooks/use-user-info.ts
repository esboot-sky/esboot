import { useMinimalAppDispatch, useMinimalAppSelector } from '@pc/model/minimal-store';
import { selectUserInfo, setUserInfo } from '@pc/model/app/slice';
import { IUserInfo } from '@pc/customize';

export function useUserInfo() {
  const userInfo = useMinimalAppSelector(selectUserInfo);
  const dispatch = useMinimalAppDispatch();

  return {
    userInfo,
    setUserInfo(newValue: IUserInfo) {
      dispatch(setUserInfo(newValue));
    },
  };
}
