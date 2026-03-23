import { cn } from '@dz-web/esboot-browser';
import { Modal, ModalProps } from 'antd';

import './base-modal.scss';

interface IProps {
  modalProps: ModalProps;
  children: React.ReactNode;
}

const BaseModal = ({ modalProps, children }: IProps) => {
  return (
    <Modal {...modalProps} className={cn('base-modal', modalProps.className)}>
      {children}
    </Modal>
  );
};

export default BaseModal;
