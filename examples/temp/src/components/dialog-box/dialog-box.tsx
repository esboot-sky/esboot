import { Mask } from 'antd-mobile';
import React, { ReactNode } from 'react';

import IconClosePop from '@/images/quote/icon_close_pop_24.svg?url';

import './dialog-box.scss';

interface IMask {
  visible: boolean;
  content: ReactNode | null;
  setVisible: (v: boolean) => void;
  showCloseBtn?: boolean;
  styles?: React.CSSProperties;
}

const DialogBox = (props: IMask) => {
  const { visible, setVisible, content, showCloseBtn = true, styles = {} } = props;

  return (
    <Mask
      visible={visible}
      getContainer={document.body}
      disableBodyScroll
      destroyOnClose
      onMaskClick={() => setVisible(false)}
    >
      <div styleName="mask-box" style={styles}>
        {content}
        {showCloseBtn && (
          <div
            styleName="close-btn"
            onClick={() => {
              setVisible(false);
            }}
          >
            <img src={IconClosePop} alt="" />
          </div>
        )}
      </div>
    </Mask>
  );
};

export default DialogBox;
