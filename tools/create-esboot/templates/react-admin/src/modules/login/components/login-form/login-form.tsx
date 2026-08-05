import type { SubmitHandler } from 'react-hook-form';
import type { IMenu, IModuleItem } from '@/model/app';
import { LoadingOutlined, RedoOutlined } from '@ant-design/icons';
import { cn } from '@dz-web/esboot-browser';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/model/app';

import { login, queryModuleList } from '../../api/login';
import useGetCode from '../../hooks/use-get-code';
import LoginAccount from '../../images/login-account.svg?url';
import LoginCode from '../../images/login-code.svg?url';
import LoginPass from '../../images/login-pass.svg?url';
import { passwordEncrypt } from '../../utils';
import LanguageBtns from '../language-btns/language-btns';
import LoginFormItem from '../login-form-item/login-form-item';

interface Inputs {
  username: string;
  password: string;
  code: string;
}

function getDeepestPath(item: IMenu): string {
  if (!item.children || item.children.length === 0) {
    return item.path;
  }
  return getDeepestPath(item.children[0]);
}

const formInputClassName
  = 'h-[30px] flex-1 px-[11px] placeholder:text-[var(--color-placeholder)] focus-visible:outline-none';

function LoginForm() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const { queryCode, codeUrl } = useGetCode();

  const setModuleList = useAppStore(state => state.setModuleList);
  const setCurrentModule = useAppStore(state => state.setCurrentModule);
  const setCurrentModulePath = useAppStore(state => state.setCurrentModulePath);
  const setToken = useAppStore(state => state.setToken);
  const setCurrentPermissionList = useAppStore(state => state.setCurrentPermissionList);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (loading)
      return;
    setLoading(true);
    const param = {
      username: data.username,
      password: passwordEncrypt(data.password),
      imgCode: data.code,
      sid: sessionStorage.getItem('codeSid') || '',
    };

    const loginRes = await login(param).catch(() => {
      queryCode();
    });

    if (loginRes?.code !== 0) {
      setLoading(false);
      return;
    }

    setToken(loginRes?.result.token);

    const moduleListRes = await queryModuleList().catch(() => {
    });

    if (moduleListRes?.code !== 0) {
      setLoading(false);
      return;
    }

    const moduleList = moduleListRes.result as IModuleItem[];
    setModuleList(moduleList);

    const currentModule = moduleList.find((item: IModuleItem) => item.code === 'sys');
    if (!currentModule?.menu?.length) {
      setLoading(false);
      return;
    }

    setCurrentModule(currentModule);
    setCurrentPermissionList(currentModule.permission);

    const currentModulePath = getDeepestPath(currentModule.menu[0]);
    setCurrentModulePath(currentModulePath);

    navigate(currentModulePath);

    setLoading(false);
  };

  useEffect(() => {
    queryCode();
  }, []);

  return (
    <section className={`
      box-border flex flex-col items-center px-[100px] pbs-[40px] pbe-[83px] block-full
      inline-[560px]
    `}
    >
      <h2 className="font-medium text-[30px] text-(--color-text-title)">{formatMessage({ id: 'login.login' })}</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mbs-[60px] mbe-[22px] text-[18px] inline-full"
      >
        <LoginFormItem error={errors.username?.message} icon={LoginAccount}>
          <input
            {...register('username', {
              required: formatMessage({ id: 'login.please_enter_your_account_number_mobile_phone_number' }),
            })}
            placeholder={formatMessage({ id: 'login.please_enter_your_account_number_mobile_phone_number' })}
            className={cn(formInputClassName)}
          />
        </LoginFormItem>

        <LoginFormItem error={errors.password?.message} icon={LoginCode}>
          <input
            type="password"
            {...register('password', { required: formatMessage({ id: 'login.please_enter_your_password' }) })}
            placeholder={formatMessage({ id: 'login.please_enter_your_password' })}
            className={cn(formInputClassName)}
          />
        </LoginFormItem>

        <LoginFormItem error={errors.code?.message} icon={LoginPass}>
          <input
            {...register('code', { required: formatMessage({ id: 'login.please_enter_the_verification_code' }) })}
            placeholder={formatMessage({ id: 'login.please_enter_the_verification_code' })}
            className={cn(formInputClassName)}
          />
          <img src={codeUrl} alt="" className="me-[11px] block-[27px] inline-[70px]" />
          <RedoOutlined onClick={() => queryCode()} />
        </LoginFormItem>

        <button
          type="submit"
          className={`
            mbs-[40px] flex items-center justify-center rounded-[7px] bg-[#0e67ff] text-[18px]
            text-(--color-white) block-[50px] inline-full
            disabled:opacity-50
          `}
          disabled={loading}
        >
          {loading ? <LoadingOutlined className="me-[10px]" /> : formatMessage({ id: 'login.login' })}
        </button>
      </form>
      <div className="flex justify-end inline-full">
        <LanguageBtns />
      </div>
    </section>
  );
}

export default LoginForm;
