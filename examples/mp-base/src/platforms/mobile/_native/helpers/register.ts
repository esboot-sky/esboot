import type { StandardUserConfig } from '@mobile/model/mobile';
import type { OriginalUserConfig, OriginalUserInfo } from '@/platforms/mobile/helpers/customize';
import { _onPageHide, _onPageShow, _updateUserConfig, _updateUserInfo } from '@dz-web/bridge/actions/mobile';
import { oldStyle2Standard } from '@/platforms/mobile/helpers/customize';

export function onUpdateUserConfig(handle: Parameters<typeof _updateUserConfig<StandardUserConfig>>[0]) {
  return _updateUserConfig<OriginalUserConfig>(res => handle(oldStyle2Standard(res)));
}

export function onUpdateUserInfo(handle: Parameters<typeof _updateUserInfo<OriginalUserInfo>>[0]) {
  return _updateUserInfo<OriginalUserInfo>(handle);
}

export function onPageShow(handle: Parameters<typeof _onPageShow>[0]) {
  return _onPageShow(handle);
}

export function onPageHide(handle: Parameters<typeof _onPageHide>[0]) {
  return _onPageHide(handle);
}
