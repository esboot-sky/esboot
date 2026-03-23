import { LoadingOutlined, RedoOutlined } from '@ant-design/icons';
import { cn } from '@dz-web/esboot-browser';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { IMenu, IModuleItem, useAppStore } from '@/model/app';

import { queryModuleList, login } from '../../api/login';
import useGetCode from '../../hooks/use-get-code';
import LoginAccount from '../../images/login-account.svg?url';
import LoginCode from '../../images/login-code.svg?url';
import LoginPass from '../../images/login-pass.svg?url';
import { passwordEncrypt } from '../../utils';
import LanguageBtns from '../language-btns/language-btns';
import LoginFormItem from '../login-form-item/login-form-item';

type Inputs = {
  username: string;
  password: string;
  code: string;
};

const getDeepestPath = (item: IMenu): string => {
  if (!item.children || item.children.length === 0) {
    return item.path;
  }
  return getDeepestPath(item.children[0]);
};

const formInputClassName = 'h-[30px] flex-1 px-[11px] placeholder:text-[var(--color-placeholder)] focus-visible:outline-none';

const LoginForm = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const { queryCode, codeUrl } = useGetCode();

  const setModuleList = useAppStore((state) => state.setModuleList);
  const setCurrentModule = useAppStore((state) => state.setCurrentModule);
  const setCurrentModulePath = useAppStore((state) => state.setCurrentModulePath);
  const setToken = useAppStore((state) => state.setToken);
  const setCurrentPermissionList = useAppStore((state) => state.setCurrentPermissionList);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (loading) return;
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
    <section className="box-border flex h-full w-[560px] flex-col items-center px-[100px] pb-[83px] pt-[40px]">
      <h2 className="text-[30px] font-medium text-[var(--color-text-title)]">{formatMessage({ id: 'login.LOGIN' })}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-[22px] mt-[60px] w-full text-[18px]">
        <LoginFormItem error={errors.username?.message} icon={LoginAccount}>
          <input
            {...register('username', {
              required: formatMessage({ id: 'login.PLEASE_ENTER_YOUR_ACCOUNT_NUMBER_MOBILE_PHONE_NUMBER' }),
            })}
            placeholder={formatMessage({ id: 'login.PLEASE_ENTER_YOUR_ACCOUNT_NUMBER_MOBILE_PHONE_NUMBER' })}
            className={cn(formInputClassName)}
          />
        </LoginFormItem>

        <LoginFormItem error={errors.password?.message} icon={LoginCode}>
          <input
            type="password"
            {...register('password', { required: formatMessage({ id: 'login.PLEASE_ENTER_YOUR_PASSWORD' }) })}
            placeholder={formatMessage({ id: 'login.PLEASE_ENTER_YOUR_PASSWORD' })}
            className={cn(formInputClassName)}
          />
        </LoginFormItem>

        <LoginFormItem error={errors.code?.message} icon={LoginPass}>
          <input
            {...register('code', { required: formatMessage({ id: 'login.PLEASE_ENTER_THE_VERIFICATION_CODE' }) })}
            placeholder={formatMessage({ id: 'login.PLEASE_ENTER_THE_VERIFICATION_CODE' })}
            className={cn(formInputClassName)}
          />
          <img src={codeUrl} alt="" className="mr-[11px] h-[27px] w-[70px]" />
          <RedoOutlined onClick={() => queryCode()} />
        </LoginFormItem>

        <button
          type="submit"
          className="mt-[40px] flex h-[50px] w-full items-center justify-center rounded-[7px] bg-[#0e67ff] text-[18px]
            text-[var(--color-white)] disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <LoadingOutlined className="mr-[10px]" /> : formatMessage({ id: 'login.LOGIN' })}
        </button>
      </form>
      <div className="flex w-full justify-end">
        <LanguageBtns />
      </div>
    </section>
  );
};

export default LoginForm;
