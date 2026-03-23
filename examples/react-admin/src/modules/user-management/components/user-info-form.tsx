import { Button, Input, Radio, Select, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { queryUserDeptList } from '@/api/common-api';
import { queryCheckUsername } from '@/api/user-management-api';
import BaseFormItem from '@/components/base-form-item/base-form-item';

import useQueryRoleList from '../../../hooks/use-query-role-list';

type Inputs = {
  nickname: string;
  areaCode: string;
  mobile: string;
  email?: string;
  username: string;
  password?: string;
  deptId: string;
  confirmPassword?: string;
  roleIds?: Array<unknown>;
  status: number;
};

const areaCodeOptions = [
  {
    value: '+86',
    label: '+86',
  },
  {
    value: '+865',
    label: '+865',
  },
];

export enum USER_INFO_FORM_TYPE {
  ADD = 'add',
  REVISE = 'revise',
}

interface IProps {
  type: USER_INFO_FORM_TYPE;
  defaultValues?: Inputs;
  roleName?: string;
  onCancel: () => void;
  submitHandler: (data: Inputs) => Promise<void>;
}

const UserInfoForm = (props: IProps) => {
  const { formatMessage } = useIntl();
  const { submitHandler, onCancel, type, defaultValues, roleName } = props;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<Inputs>({ mode: 'onBlur', defaultValues: defaultValues || { status: 1, areaCode: '+86' } });

  const { queryRoleList, roleList, roleNameToIds } = useQueryRoleList();

  const [userDeptList, setUserDeptList] = useState([]);
  const [isSubLoading, setIsSubLoading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubLoading(true);
    submitHandler(data).finally(() => {
      setIsSubLoading(false);
    });
  };

  const checkUsername = () => {
    const username = getValues('username');
    if (!username) return;
    queryCheckUsername({
      username,
    })
      .then((res) => {
        if (res.code === 0) {
          message.success(formatMessage({ id: 'userManagement.CHECK_LOGIN_ACCOUNT_AVAILABLE_SUCCESSFULLY' }));
        }
      })
      .catch((err) => {
      });
  };

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

  useEffect(() => {
    queryUserDeptList({
      pageSize: 100000,
    })
      .then((res) => {
        const options = res.result?.records.map((item: { [key: string]: any }) => ({
          value: item.id,
          label: item.name,
        }));
        setUserDeptList(options);
      })
      .catch((err) => {
      });

    queryRoleList();
  }, []);

  useEffect(() => {
    if (type === USER_INFO_FORM_TYPE.REVISE) {
      const _roleIds = roleNameToIds(roleName as string);
      setValue('roleIds', _roleIds);
    }
  }, [roleList]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BaseFormItem required label={formatMessage({ id: 'userManagement.USER_NAME' })} errMsg={errors.nickname?.message}>
        <Controller
          render={({ field }) => <Input {...field} />}
          {...register('nickname', {
            validate: (value) => {
              if (!value) return formatMessage({ id: 'userManagement.USER_NAME_REQUIRED' });
              if (value.length > 20) return formatMessage({ id: 'userManagement.USER_NAME_MAX_20' });
              if (value.includes(' ')) return formatMessage({ id: 'userManagement.USER_NAME_NO_SPACE' });
              return true;
            },
          })}
          control={control}
        />
      </BaseFormItem>
      <BaseFormItem required label={formatMessage({ id: 'PHONE_NUMBER' })} errMsg={errors.mobile?.message}>
        <Controller
          render={({ field }) => (
            <Space.Compact block>
              <Controller
                render={({ field: areaCodeField }) => <Select {...areaCodeField} options={areaCodeOptions} />}
                {...register('areaCode', { required: formatMessage({ id: 'userManagement.AREA_CODE_REQUIRED' }) })}
                control={control}
              />

              <Input {...field} />
            </Space.Compact>
          )}
          {...register('mobile', {
            validate: (value) => {
              if (!value) return formatMessage({ id: 'userManagement.MOBILE_REQUIRED' });
              if (value.includes(' ')) return formatMessage({ id: 'userManagement.MOBILE_NO_SPACE' });
              return true;
            },
          })}
          control={control}
        />
      </BaseFormItem>

      <BaseFormItem label={formatMessage({ id: 'EMAIL' })} errMsg={errors.email?.message}>
        <Controller
          render={({ field }) => <Input {...field} />}
          {...register('email', {
            pattern: {
              value: /^[A-Za-z0-9-._]+@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,6})$/,
              message: formatMessage({ id: 'userManagement.EMAIL_INVALID' }),
            },
          })}
          control={control}
        />
      </BaseFormItem>

      <BaseFormItem label={formatMessage({ id: 'userManagement.LOGIN_ACCOUNT' })} required errMsg={errors.username?.message}>
        <Controller
          render={({ field }) => (
            <Space.Compact block>
              <Input {...field} />
              <Button onClick={checkUsername}>{formatMessage({ id: 'userManagement.CHECK_AVAILABLE' })}</Button>
            </Space.Compact>
          )}
          {...register('username', {
            required: formatMessage({ id: 'userManagement.LOGIN_ACCOUNT_REQUIRED' }),
            validate: (value) => {
              if (!value) return formatMessage({ id: 'userManagement.LOGIN_ACCOUNT_REQUIRED' });
              if (value.includes(' ')) return formatMessage({ id: 'userManagement.LOGIN_ACCOUNT_NO_SPACE' });
              return true;
            },
          })}
          control={control}
        />
      </BaseFormItem>

      {type === USER_INFO_FORM_TYPE.ADD && (
        <BaseFormItem required label={formatMessage({ id: 'userManagement.LOGIN_PASSWORD' })} errMsg={errors.password?.message}>
          <Controller
            render={({ field }) => <Input {...field} />}
            {...register('password', {
              validate: validatePassWord,
            })}
            control={control}
          />
        </BaseFormItem>
      )}
      <BaseFormItem required label={formatMessage({ id: 'DEPARTMENT' })} errMsg={errors.deptId?.message}>
        <Controller
          render={({ field }) => <Select {...field} options={userDeptList} className="w-full" />}
          {...register('deptId', {
            required: formatMessage({ id: 'userManagement.DEPT_REQUIRED' }),
          })}
          control={control}
        />
      </BaseFormItem>
      {type === USER_INFO_FORM_TYPE.ADD && (
        <BaseFormItem required label={formatMessage({ id: 'userManagement.CONFIRM_PASSWORD' })} errMsg={errors.confirmPassword?.message}>
          <Controller
            render={({ field }) => <Input {...field} />}
            {...register('confirmPassword', {
              validate: validatePassWord,
            })}
            control={control}
          />
        </BaseFormItem>
      )}
      <BaseFormItem label={formatMessage({ id: 'ROLE' })} errMsg={errors.roleIds?.message}>
        <Controller
          render={({ field }) => (
            <Select {...field} options={roleList} className="w-full" mode="multiple" allowClear showSearch={false} />
          )}
          {...register('roleIds')}
          control={control}
        />
      </BaseFormItem>
      <BaseFormItem required label={formatMessage({ id: 'STATUS' })} errMsg={errors.status?.message}>
        <Controller
          render={({ field }) => (
            <Radio.Group {...field}>
              <Radio value={1}>{formatMessage({ id: 'ENABLE' })}</Radio>
              <Radio value={0}>{formatMessage({ id: 'DISABLE' })}</Radio>
            </Radio.Group>
          )}
          {...register('status', {
            required: true,
          })}
          control={control}
        />
      </BaseFormItem>
      <div className="text-center">
        <Button className="mr-[12px]" onClick={onCancel}>
          {formatMessage({ id: 'CANCEL' })}
        </Button>
        <Button type="primary" htmlType="submit" loading={isSubLoading}>
          {formatMessage({ id: 'CONFIRM' })}
        </Button>
      </div>
    </form>
  );
};

export default UserInfoForm;
