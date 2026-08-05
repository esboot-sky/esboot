import type { IModuleItem } from '@/model';
import { AppstoreOutlined, LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Popover } from 'antd';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useLoginStore } from '@/model';
import { changePasswordApi, getExternalModuleUrl } from '@/modules/login/api/login';
import { cn } from '@/utils/cn';
import { getDefaultModulePath, passwordEncrypt } from '@/utils/common';

const PASSWORD_REGEX = /^(?!\d+$)(?![a-z]+$)[0-9a-z]{8,16}$/i;

export default function Header() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const currentModule = useLoginStore(state => state.currentModule);
  const moduleList = useLoginStore(state => state.moduleList);
  const accountInfo = useLoginStore(state => state.accountInfo);

  const setCurrentModule = useLoginStore(state => state.setCurrentModule);
  const setCurrentModulePath = useLoginStore(state => state.setCurrentModulePath);
  const resetStore = useLoginStore(state => state.reset);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [changePwdVisible, setChangePwdVisible] = useState(false);
  const [changePwdLoading, setChangePwdLoading] = useState(false);
  const [form] = Form.useForm();

  const handleModuleClick = useCallback(
    (moduleItem: IModuleItem) => {
      setPopoverOpen(false);

      if (moduleItem?.isExternal) {
        getExternalModuleUrl({ moduleCode: moduleItem.code }).then((res: any) => {
          if (res?.result) {
            window.location.href = res.result;
          }
        });
        return;
      }

      setCurrentModule(moduleItem);
      const defaultPath = getDefaultModulePath(moduleItem);
      if (defaultPath) {
        setCurrentModulePath(defaultPath);
        navigate(defaultPath);
      }
    },
    [navigate, setCurrentModule, setCurrentModulePath],
  );

  const handleLogout = useCallback(() => {
    setPopoverOpen(false);
    Modal.confirm({
      title: formatMessage({ id: 'header.logoutConfirmTitle' }),
      content: formatMessage({ id: 'header.logoutConfirmContent' }),
      okText: formatMessage({ id: 'header.confirmLogout' }),
      cancelText: formatMessage({ id: 'header.cancel' }),
      okButtonProps: { danger: true },
      onOk() {
        resetStore();
        navigate('/login', { replace: true });
      },
    });
  }, [formatMessage, navigate, resetStore]);

  const handleChangePasswordSubmit = async (values: any) => {
    setChangePwdLoading(true);
    try {
      const payload = {
        password: passwordEncrypt(values.password),
        confirmPassword: passwordEncrypt(values.confirmPassword),
      };
      const res: any = await changePasswordApi(payload);
      if (res?.code === 0) {
        message.success(formatMessage({ id: 'changePasswordModal.successMsg' }));
        setChangePwdVisible(false);
        form.resetFields();
        resetStore();
        navigate('/login', { replace: true });
      }
      else {
        message.error(res?.message || formatMessage({ id: 'changePasswordModal.failMsg' }));
      }
    }
    catch (err: any) {
      message.error(err?.message || formatMessage({ id: 'changePasswordModal.failMsg' }));
    }
    finally {
      setChangePwdLoading(false);
    }
  };

  const defaultRoleText = formatMessage({ id: 'header.defaultRole' });

  const userPopoverContent = (
    <div className="p-3 select-none inline-[320px]">
      <div className="pb-3 border-slate-100 flex items-center justify-between border-be">
        <div className="gap-3 flex items-center">
          <div className="
            h-11 w-11 from-blue-600 to-indigo-600 text-white font-semibold shadow-xs flex
            items-center justify-center rounded-full bg-linear-to-tr
          "
          >
            <UserOutlined className="text-[20px]" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-[15px]">
              {accountInfo?.nickname || accountInfo?.username || defaultRoleText}
            </div>
            <div className="font-medium text-slate-400 text-[12px]">
              {accountInfo?.roleName || defaultRoleText}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="
            font-medium text-blue-600
            hover:text-blue-700
            cursor-pointer text-[13px]
            hover:underline
          "
          onClick={() => {
            setPopoverOpen(false);
            setChangePwdVisible(true);
          }}
        >
          {formatMessage({ id: 'header.changePassword' })}
        </button>
      </div>

      <div className="my-2">
        <ul className="m-0 p-0 space-y-1 list-none overflow-y-auto max-block-[260px]">
          {moduleList.map((item: IModuleItem) => {
            const isCurrent = currentModule?.code === item.code;
            return (
              <li
                key={item.code}
                onClick={() => handleModuleClick(item)}
                className={cn(
                  `
                    rounded-lg px-3 flex cursor-pointer items-center justify-between py-[3px]!
                    text-[14px] transition-colors
                  `,
                  isCurrent
                    ? 'bg-blue-50 font-semibold text-blue-600'
                    : `
                      text-slate-700
                      hover:bg-slate-50 hover:text-slate-900
                    `,
                )}
              >
                <div className="gap-2.5 flex items-center">
                  <AppstoreOutlined className="text-slate-400 text-[16px]" />
                  <span>{item.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pt-2 border-slate-100 border-bs">
        <Button
          danger
          block
          onClick={handleLogout}
          icon={<LogoutOutlined />}
          className="rounded-lg h-9 font-medium"
        >
          {formatMessage({ id: 'header.logout' })}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="
        border-slate-200/80 bg-white pr-6 shadow-xs relative z-20 flex items-center justify-between
        border-be select-none block-[64px] inline-full
      "
      >
        <div className="flex items-center block-full">
          <div className="px-6 flex flex-none items-center justify-start inline-[285px]">
            <img
              src="/static/logo.svg"
              alt="logo"
              className="object-contain block-[36px] max-inline-[200px]"
            />
          </div>
        </div>

        <div className="flex items-center">
          <Popover
            content={userPopoverContent}
            trigger="click"
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
            placement="bottomRight"
          >
            <div className="
              gap-3 border-slate-200/80 bg-slate-50/80 px-3.5 py-1.5
              hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-xs
              flex cursor-pointer items-center rounded-full border transition-all
            "
            >
              <div className="
                h-8 w-8 from-blue-600 to-indigo-600 text-white font-medium shadow-xs flex
                items-center justify-center rounded-full bg-linear-to-br
              "
              >
                <UserOutlined className="text-[16px]" />
              </div>
              <div className="text-start">
                <div className="font-semibold text-slate-800 leading-tight text-[13px]">
                  {accountInfo?.nickname || accountInfo?.username || defaultRoleText}
                </div>
                <div className="text-slate-400 leading-tight text-[11px]">
                  {accountInfo?.roleName || defaultRoleText}
                </div>
              </div>
            </div>
          </Popover>
        </div>
      </div>

      <Modal
        title={formatMessage({ id: 'changePasswordModal.title' })}
        open={changePwdVisible}
        onCancel={() => {
          setChangePwdVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnHidden
        centered
        width={460}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePasswordSubmit}
          className="mt-4"
        >
          <Form.Item
            label={formatMessage({ id: 'changePasswordModal.usernameLabel' })}
            className="mb-3"
          >
            <Input
              disabled
              value={accountInfo?.username || accountInfo?.nickname || 'admin'}
              className="rounded-lg bg-slate-50 text-slate-700"
            />
          </Form.Item>

          <Form.Item
            label={formatMessage({ id: 'changePasswordModal.newPasswordLabel' })}
            name="password"
            rules={[
              { required: true, message: formatMessage({ id: 'changePasswordModal.inputRequired' }) },
              { pattern: PASSWORD_REGEX, message: formatMessage({ id: 'changePasswordModal.passwordRule' }) },
            ]}
            className="mb-3"
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400" />}
              placeholder={formatMessage({ id: 'changePasswordModal.newPasswordPlaceholder' })}
              className="rounded-lg py-2"
            />
          </Form.Item>

          <Form.Item
            label={formatMessage({ id: 'changePasswordModal.confirmPasswordLabel' })}
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: formatMessage({ id: 'changePasswordModal.confirmRequired' }) },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(formatMessage({ id: 'changePasswordModal.passwordMismatch' })));
                },
              }),
            ]}
            className="mb-5"
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400" />}
              placeholder={formatMessage({ id: 'changePasswordModal.confirmPasswordPlaceholder' })}
              className="rounded-lg py-2"
            />
          </Form.Item>

          <div className="gap-2 pt-3 border-slate-100 flex justify-end border-bs">
            <Button onClick={() => setChangePwdVisible(false)} className="rounded-lg">
              {formatMessage({ id: 'changePasswordModal.cancel' })}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={changePwdLoading}
              className="
                rounded-lg bg-blue-600
                hover:bg-blue-700
              "
            >
              {formatMessage({ id: 'changePasswordModal.submit' })}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
