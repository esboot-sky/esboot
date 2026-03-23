import { Button, Input, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import BaseFormItem from '@/components/base-form-item/base-form-item';
import useQueryRoleList from '@/hooks/use-query-role-list';

import SelectPermissionsModal from './select-permissions-modal';

type Inputs = {
  parentId: string;
  name: string;
  remark: string;
};

export enum ROLE_INFO_FORM_TYPE {
  ADD = 'add',
  REVISE = 'revise',
}

type ModulesItem = {
  code: string;
  menuIds: number[];
};

type Modules = ModulesItem[];
interface IProps {
  type: ROLE_INFO_FORM_TYPE;
  defaultValues?: Inputs;
  roleName?: string;
  onCancel: () => void;
  submitHandler: (data: Inputs, modules: Modules) => Promise<void>;
}
const RoleInfoForm = (props: IProps) => {
  const { formatMessage } = useIntl();
  const { submitHandler, onCancel, type, defaultValues } = props;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<Inputs>({ mode: 'onBlur', defaultValues });

  const { queryRoleList, roleList } = useQueryRoleList();

  const [isSubLoading, setIsSubLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modules, setModules] = useState<Modules>([]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubLoading(true);
    submitHandler(data, modules).finally(() => {
      setIsSubLoading(false);
    });
  };

  useEffect(() => {
    queryRoleList();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BaseFormItem label={formatMessage({ id: 'roleManagement.PARENT_ROLE' })} errMsg={errors.parentId?.message} required>
        <Controller
          render={({ field }) => (
            <Select
              {...field}
              options={roleList}
              className="w-full"
              allowClear
              showSearch={false}
              placeholder={formatMessage({ id: 'roleManagement.PLEASE_SELECT_PARENT_ROLE' })}
            />
          )}
          {...register('parentId', { required: formatMessage({ id: 'roleManagement.PLEASE_SELECT_PARENT_ROLE' }) })}
          control={control}
        />
      </BaseFormItem>

      <BaseFormItem required label={formatMessage({ id: 'roleManagement.ROLE_NAME' })} errMsg={errors.name?.message}>
        <Controller
          render={({ field }) => <Input {...field} />}
          {...register('name', {
            required: formatMessage({ id: 'roleManagement.PLEASE_ENTER_ROLE_NAME' }),
          })}
          control={control}
        />
      </BaseFormItem>

      {type === ROLE_INFO_FORM_TYPE.ADD && (
        <BaseFormItem label={formatMessage({ id: 'roleManagement.PERMISSIONS' })}>
          <Button
            onClick={() => {
              if (!getValues('parentId')) {
                message.warning(formatMessage({ id: 'roleManagement.PLEASE_SELECT_PARENT_ROLE_FIRST' }));
                return;
              }
              setIsModalOpen(true);
            }}
          >
            {formatMessage({ id: 'roleManagement.CLICK_TO_SET' })}
          </Button>
          <SelectPermissionsModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            getValues={getValues}
            onConfirm={(v) => setModules(v)}
          />
        </BaseFormItem>
      )}

      <BaseFormItem label={formatMessage({ id: 'roleManagement.REMARK' })} errMsg={errors.remark?.message}>
        <Controller render={({ field }) => <Input {...field} />} {...register('remark')} control={control} />
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

export default RoleInfoForm;
