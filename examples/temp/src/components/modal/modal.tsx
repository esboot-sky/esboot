import { cn, cva } from '@dz-web/esboot-browser';
import { Button, Mask, type ButtonProps } from 'antd-mobile';
import { PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';

import './modal.scss';

interface ModalBaseProps extends PropsWithChildren {
  style?: React.CSSProperties;
  className?: string;
}

interface ModalProps extends ModalBaseProps {
  visible: boolean;
  setVisible?: (v: boolean) => void;
}

const Modal = (props: ModalProps) => {
  const { visible, style = {}, className, children, ...rest } = props;

  return (
    <Mask
      visible={visible}
      getContainer={document.body}
      disableBodyScroll
      destroyOnClose
      className={cn('modal-mask', className)}
      style={style}
      {...rest}
    >
      <div className="content-background flex flex-col overflow-hidden rounded-[16px]">{children}</div>
    </Mask>
  );
};

const Title = (props: ModalBaseProps) => {
  const { children, className, style } = props;
  return (
    <div className={cn('text-main-color mt-[50px] text-center text-[32px]', className)} style={style}>
      {children}
    </div>
  );
};

const Tips = (props: ModalBaseProps) => {
  const { className, style } = props;
  return (
    <Title className={className} style={style}>
      <FormattedMessage id="global.tips" />
    </Title>
  );
};

const Content = (props: ModalBaseProps) => {
  const { children, className, style } = props;
  return (
    <div className={cn('font-regular-28 p-[40px] pt-[34px]', className)} style={style}>
      {children}
    </div>
  );
};

interface ActionButtonProps extends ModalBaseProps {
  theme?: 'confirm' | 'cancel';
}

const actionButtonClassName = cva(
  'flex-1 border-0 !border-r !border-r-[var(--divide-line-color)] py-[22px] last:border-r-0 !rounded-none',
  {
    variants: {
      theme: {
        confirm: 'text-[var(--main-text-color)] font-bold',
        cancel: 'text-[var(--secondary-text-color)]',
      },
    },
  },
);

const ActionButton = (props: ActionButtonProps & ButtonProps) => {
  const { children, className, style, theme = 'confirm', ...rest } = props;
  return (
    <Button className={cn(actionButtonClassName({ theme }), className)} style={style} {...rest}>
      {children}
    </Button>
  );
};

const CancelActionButton = (props: ActionButtonProps & ButtonProps) => {
  return (
    <ActionButton theme="cancel" {...props}>
      <FormattedMessage id="global.cancel" />
    </ActionButton>
  );
};

const ConfirmActionButton = (props: ActionButtonProps & ButtonProps) => {
  return (
    <ActionButton theme="confirm" {...props}>
      <FormattedMessage id="global.confirm" />
    </ActionButton>
  );
};

const Actions = (props: ModalBaseProps) => {
  const { children, className, style } = props;

  return (
    <div className={cn('flex justify-between border-t border-t-[var(--divide-line-color)]', className)} style={style}>
      {children}
    </div>
  );
};

Modal.Tips = Tips;
Modal.Title = Title;
Modal.Content = Content;
Modal.Actions = Actions;
Modal.ActionButton = ActionButton;
Modal.CancelActionButton = CancelActionButton;
Modal.ConfirmActionButton = ConfirmActionButton;

export default Modal;
