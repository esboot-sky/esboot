import type { SubmitHandler } from 'react-hook-form';
import { LoadingOutlined, RedoOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useLoginStore } from '@/model';
import { cn } from '@/utils/cn';
import { getDefaultModulePath, passwordEncrypt, processModuleList } from '@/utils/common';

import { fetchModuleList, login } from '../../api/login';
import useGetCode from '../../hooks/use-get-code';
import LoginAccount from '../../images/login-account.svg?url';
import LoginCode from '../../images/login-code.svg?url';
import LoginPass from '../../images/login-pass.svg?url';
import LanguageBtns from '../language-btns/language-btns';
import LoginFormItem from '../login-form-item/login-form-item';

interface Inputs {
  username: string;
  password: string;
  code: string;
}

const formInputClassName
  = 'h-[30px] flex-1 px-[11px] placeholder:text-slate-400 '
    + 'focus-visible:outline-none bg-transparent border-none text-slate-800 text-[15px]';

export default function LoginForm() {
  const navigate = useNavigate();
  const { queryCode, codeUrl } = useGetCode();

  const setModuleList = useLoginStore(state => state.setModuleList);
  const setCurrentModule = useLoginStore(state => state.setCurrentModule);
  const setCurrentModulePath = useLoginStore(state => state.setCurrentModulePath);
  const setToken = useLoginStore(state => state.setToken);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const param = {
        username: data.username,
        password: passwordEncrypt(data.password),
        imgCode: data.code,
        sid: sessionStorage.getItem('codeSid') || '',
      };

      const loginRes: any = await login(param);
      if (loginRes?.code !== 0) {
        message.error(loginRes?.message || '登录失败');
        setLoading(false);
        queryCode();
        return;
      }

      setToken(loginRes?.result?.token || '');

      const moduleListRes: any = await fetchModuleList();
      if (moduleListRes?.code !== 0) {
        message.error(moduleListRes?.message || '获取模块列表失败');
        setLoading(false);
        queryCode();
        return;
      }

      const rawModuleList = moduleListRes.result || [];
      const moduleList = processModuleList(rawModuleList);
      setModuleList(moduleList);

      const currentModule = moduleList[0];
      if (currentModule) {
        setCurrentModule(currentModule);
        const currentModulePath = getDefaultModulePath(currentModule);
        setCurrentModulePath(currentModulePath);
        navigate(currentModulePath);
      }
      else {
        navigate('/');
      }
    }
    catch (err: any) {
      console.error('[LoginForm] onSubmit error:', err);
      message.error(err?.message || '登录异常，请稍后再试');
      queryCode();
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queryCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <section className="
      box-border flex flex-col items-center px-[100px] pbs-[40px] pbe-[83px] block-full
      inline-[560px]
    "
    >
      <h2 className="font-medium text-[30px] text-[#212121]">登录</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mbs-[60px] mbe-[22px] text-[18px] inline-full"
      >
        <LoginFormItem error={errors.username?.message} icon={LoginAccount}>
          <input
            {...register('username', { required: '请输入账号/手机号' })}
            placeholder="请输入账号/手机号"
            className={cn(formInputClassName)}
          />
        </LoginFormItem>

        <LoginFormItem error={errors.password?.message} icon={LoginCode}>
          <input
            type="password"
            {...register('password', { required: '请输入密码' })}
            placeholder="请输入密码"
            className={cn(formInputClassName)}
          />
        </LoginFormItem>

        <LoginFormItem error={errors.code?.message} icon={LoginPass}>
          <input
            {...register('code', { required: '请输入验证码' })}
            placeholder="请输入验证码"
            className={cn(formInputClassName)}
          />
          <img src={codeUrl} alt="" className="me-[11px] object-contain block-[27px] inline-[70px]" />
          <RedoOutlined
            onClick={() => queryCode()}
            className="
              text-slate-400
              hover:text-blue-600
              cursor-pointer
            "
          />
        </LoginFormItem>

        <button
          type="submit"
          disabled={loading}
          className="
            mbs-[40px] flex cursor-pointer items-center justify-center rounded-[7px] bg-[#0e67ff]
            text-[18px] text-[#fff] transition-opacity block-[50px] inline-full
            disabled:opacity-50
          "
        >
          {loading ? <LoadingOutlined className="me-[10px]" /> : '登录'}
        </button>
      </form>

      <div className="flex justify-end inline-full">
        <LanguageBtns />
      </div>
    </section>
  );
}
