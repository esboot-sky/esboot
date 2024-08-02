import { IUserInfo } from '@pc/customize';
import { selectUserInfo, setUserInfo } from '@pc/model/app/slice';
import { useMinimalAppDispatch, useMinimalAppSelector } from '@pc/model/minimal-store';

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
