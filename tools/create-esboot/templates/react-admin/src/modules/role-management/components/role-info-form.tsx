import type { SubmitHandler } from 'react-hook-form';
import { Button, Input, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import BaseFormItem from '@/components/base-form-item/base-form-item';
import useQueryRoleList from '@/hooks/use-query-role-list';

import SelectPermissionsModal from './select-permissions-modal';

interface Inputs {
  parentId: string;
  name: string;
  remark: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export enum ROLE_INFO_FORM_TYPE {
  ADD = 'add',
  REVISE = 'revise',
}

interface ModulesItem {
  code: string;
  menuIds: number[];
}

type Modules = ModulesItem[];
interface IProps {
  type: ROLE_INFO_FORM_TYPE;
  defaultValues?: Inputs;
  roleName?: string;
  onCancel: () => void;
  submitHandler: (data: Inputs, modules: Modules) => Promise<void>;
}
function RoleInfoForm(props: IProps) {
  const { formatMessage } = useIntl();
  const [messageApi, contextHolder] = message.useMessage();
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
  }, [queryRoleList]);

  return (
    <>
      {contextHolder}
      <form onSubmit={handleSubmit(onSubmit)}>
        <BaseFormItem
          label={formatMessage({ id: 'rolemanagement.parent_role' })}
          errMsg={errors.parentId?.message}
          required
        >
          <Controller
            render={({ field }) => (
              <Select
                {...field}
                options={roleList}
                className="w-full"
                allowClear
                showSearch={false}
                placeholder={formatMessage({ id: 'rolemanagement.please_select_parent_role' })}
              />
            )}
            {...register('parentId', { required: formatMessage({ id: 'rolemanagement.please_select_parent_role' }) })}
            control={control}
          />
        </BaseFormItem>

        <BaseFormItem required label={formatMessage({ id: 'rolemanagement.role_name' })} errMsg={errors.name?.message}>
          <Controller
            render={({ field }) => <Input {...field} />}
            {...register('name', {
              required: formatMessage({ id: 'rolemanagement.please_enter_role_name' }),
            })}
            control={control}
          />
        </BaseFormItem>

        {type === ROLE_INFO_FORM_TYPE.ADD && (
          <BaseFormItem label={formatMessage({ id: 'rolemanagement.permissions' })}>
            <Button
              onClick={() => {
                if (!getValues('parentId')) {
                  messageApi.warning(formatMessage({ id: 'rolemanagement.please_select_parent_role_first' }));
                  return;
                }
                setIsModalOpen(true);
              }}
            >
              {formatMessage({ id: 'rolemanagement.click_to_set' })}
            </Button>
            <SelectPermissionsModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              getValues={getValues}
              onConfirm={v => setModules(v)}
            />
          </BaseFormItem>
        )}

        <BaseFormItem label={formatMessage({ id: 'rolemanagement.remark' })} errMsg={errors.remark?.message}>
          <Controller render={({ field }) => <Input {...field} />} {...register('remark')} control={control} />
        </BaseFormItem>

        <div className="text-center">
          <Button className="mr-[12px]" onClick={onCancel}>
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button type="primary" htmlType="submit" loading={isSubLoading}>
            {formatMessage({ id: 'confirm' })}
          </Button>
        </div>
      </form>
    </>
  );
}

export default RoleInfoForm;
