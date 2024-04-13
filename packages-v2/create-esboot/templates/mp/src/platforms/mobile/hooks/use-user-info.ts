import { useMinimalAppDispatch, useMinimalAppSelector } from '@mobile/model/minimal-store';
import { selectUserInfo, setUserInfo } from '@mobile/model/app/slice';
import { IUserInfo } from '@mobile/customize';

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
