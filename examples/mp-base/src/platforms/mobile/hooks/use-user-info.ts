import { IUserInfo } from '@mobile/customize';
import { selectUserInfo, setUserInfo } from '@mobile/model/app/slice';
import { useMinimalAppDispatch, useMinimalAppSelector } from '@mobile/model/minimal-store';

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
