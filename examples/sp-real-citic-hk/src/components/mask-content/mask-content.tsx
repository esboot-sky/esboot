import { Mask } from 'antd-mobile';
import React, { ReactNode } from 'react';

import IconClosePop from './icons/icon_close_pop_24.svg?url';
import './mask-content.scss';

interface IMask {
  visible: boolean;
  content: ReactNode | null;
  setVisible: (v: boolean) => void;
  showCloseBtn?: boolean;
  styles?: React.CSSProperties;
  color?: string;
}

const MaskContent: React.FC<IMask> = ({ visible, setVisible, content, showCloseBtn, styles, color }) => (
  <Mask visible={visible} getContainer={document.body} disableBodyScroll destroyOnClose color={color}>
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

// MaskContent.defaultProps = {
//   showCloseBtn: true,
//   styles: {},
//   color: ColorMap.overlay50,
// };

export default MaskContent;
