import { Button, Input, message } from 'antd';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { queryResetPwd } from '@/api/user-management-api';
import BaseFormItem from '@/components/base-form-item/base-form-item';
import BaseModal from '@/components/base-modal/base-modal';
import { passwordEncrypt } from '@/modules/login/utils';

interface IProps {
  subSuccess: () => void;
  rowItem: {
    id: number;
    nickname: string;
    username: string;
  };
}

type Inputs = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordModal = ({ subSuccess, rowItem: { username, nickname, id } }: IProps) => {
  const { formatMessage } = useIntl();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    reset,
  } = useForm<Inputs>({ mode: 'onBlur' });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const validatePassWord = (value: string) => {
    const isExtent = /^.{8,16}$/.exec(value);
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z_]{8,16}$/;
    if (!reg.test(value)) {
      return formatMessage({ id: 'userManagement.PASSWORD_RULE' });
    }
    if (!isExtent) {
      return formatMessage({ id: 'userManagement.PASSWORD_LENGTH_RULE' });
    }
    const password = getValues('password');
    const confirmPassword = getValues('confirmPassword');

    const isExist = password && confirmPassword;
    const isUnlikeness = password !== confirmPassword;

    if (isExist && isUnlikeness) {
      return formatMessage({ id: 'userManagement.PASSWORD_NOT_MATCH' });
    }

    return true;
  };

  const onCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setConfirmLoading(true);

    const params = {
      id,
      password: passwordEncrypt(data.password),
    };

    queryResetPwd(params)
      .then(() => {
        message.success(formatMessage({ id: 'userManagement.RESET_PASSWORD_SUCCESSFULLY' }));
        subSuccess();
        setIsModalOpen(false);
      })
      .catch((err) => {
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  return (
    <>
      <Button type="link" className="!h-full !px-[5px] !py-0" onClick={() => setIsModalOpen(true)}>
        {formatMessage({ id: 'userManagement.RESET_PASSWORD' })}
      </Button>
      <BaseModal
        modalProps={{
          title: formatMessage({ id: 'userManagement.RESET_PASSWORD' }),
          open: isModalOpen,
          destroyOnClose: true,
          onCancel,
          footer: false,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <BaseFormItem label={formatMessage({ id: 'userManagement.USER_NAME' })}>{nickname}</BaseFormItem>
          <BaseFormItem label={formatMessage({ id: 'userManagement.LOGIN_ACCOUNT' })}>{username}</BaseFormItem>
          <BaseFormItem label={formatMessage({ id: 'userManagement.INPUT_PASSWORD' })} errMsg={errors.password?.message} required>
            <Controller
              render={({ field }) => <Input {...field} placeholder={formatMessage({ id: 'userManagement.PASSWORD_PLACEHOLDER' })} />}
              {...register('password', {
                validate: validatePassWord,
              })}
              control={control}
            />
          </BaseFormItem>
          <BaseFormItem label={formatMessage({ id: 'userManagement.CONFIRM_PASSWORD' })} errMsg={errors.confirmPassword?.message} required>
            <Controller
              render={({ field }) => <Input {...field} placeholder={formatMessage({ id: 'userManagement.PASSWORD_PLACEHOLDER' })} />}
              {...register('confirmPassword', {
                validate: validatePassWord,
              })}
              control={control}
            />
          </BaseFormItem>

          <div className="text-center">
            <Button className="mr-[12px]" onClick={onCancel}>
              {formatMessage({ id: 'CANCEL' })}
            </Button>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              {formatMessage({ id: 'CONFIRM' })}
            </Button>
          </div>
        </form>
      </BaseModal>
    </>
  );
};

export default ResetPasswordModal;
