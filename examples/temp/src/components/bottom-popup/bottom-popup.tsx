import { Popup } from 'antd-mobile';
import { ReactNode, PropsWithChildren } from 'react';

import IconClose from '@/components/date-diy/images/close.svg?url';

import './bottom-popup.scss';

interface BottomPopupProps {
  visible: boolean;
  title?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  closeWhenMaskClick?: boolean;
}

const BottomPopup = (props: PropsWithChildren<BottomPopupProps>) => {
  const { visible, onClose, title = null, footer = null, children, closeWhenMaskClick = false } = props;

  return (
    <Popup
      visible={visible}
      onMaskClick={closeWhenMaskClick ? onClose : undefined}
      bodyStyle={{
        borderTopLeftRadius: '.12rem',
        borderTopRightRadius: '.12rem',
      }}
    >
      <div styleName="container" className="popup">
        <div styleName="title">{title && <div>{title}</div>}</div>
        <img onClick={onClose} src={IconClose} alt="" styleName="close-icon" />

        <div styleName="content">{children}</div>

        {footer}
      </div>
    </Popup>
  );
};

export default BottomPopup;
