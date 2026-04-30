import { message } from 'antd';
import { useForm, SubmitHandler } from 'react-hook-form';
// import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useLoginStore } from '@/model';

import { fetchModuleList, login } from '../../api/login';
import LoginAccount from '../../images/login-account.svg?url';
import LoginCode from '../../images/login-code.svg?url';
import LoginPass from '../../images/login-pass.svg?url';
import { passwordEncrypt } from '../../utils';
import FromInputItem, { INPUT_TYPE } from '../from-input-item/from-input-item';
import LanguageBtns from '../language-btns/language-btns';

type Inputs = {
  username: string;
  password: string;
  code: string;
};

const getDeepestPath = (item) => {
  if (!item.children || item.children.length === 0) {
    return item.path;
  }
  return getDeepestPath(item.children[0]);
};

const LoginForm = () => {
  const navigate = useNavigate();

  const setModuleList = useLoginStore((state) => state.setModuleList);
  const setCurrentModule = useLoginStore((state) => state.setCurrentModule);
  const setCurrentModulePath = useLoginStore((state) => state.setCurrentModulePath);
  const setToken = useLoginStore((state) => state.setToken);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const param = {
      username: data.username,
      password: data.password,
      imgCode: data.code,
      sid: sessionStorage.getItem('codeSid') || '',
    };

    if (data.username !== 'admin') {
      param.password = passwordEncrypt(data.password);
    }

    const loginRes = await login(param).catch((err) => {
      console.log(err, '---> err');
      message.error(err.message);
    });

    if (loginRes?.code !== 0) return;

    setToken(loginRes?.result.token || '');

    const moduleListRes = await fetchModuleList().catch((err) => {
      console.log(err, '---> err');
      message.error(err.message);
    });

    if (moduleListRes?.code !== 0) return;

    const moduleList = moduleListRes.result;
    setModuleList(moduleList);

    const currentModule = moduleList?.[0];
    setCurrentModule(currentModule);

    const currentModulePath = getDeepestPath(currentModule.menu[0]);
    setCurrentModulePath(currentModulePath);

    navigate(currentModulePath);
  };

  return (
    <section className="box-border flex h-full w-[560px] flex-col items-center px-[100px] pb-[83px] pt-[40px]">
      <h2 className="text-[30px] font-medium  text-[#212121]">登录</h2>
      {/* <FormattedMessage id="name" /> */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-[22px] mt-[60px] w-full text-[18px]">
        <FromInputItem
          name="username"
          placeholder="请输入账号/手机号"
          icon={LoginAccount}
          register={register('username', { required: '请输入账号/手机号' })}
          error={errors.username?.message}
        />
        <FromInputItem
          name="password"
          placeholder="请输入密码"
          icon={LoginPass}
          type={INPUT_TYPE.PASSWORD}
          register={register('password', { required: '请输入密码' })}
          error={errors.password?.message}
          control={control}
        />
        <FromInputItem
          name="code"
          placeholder="请输入验证码"
          icon={LoginCode}
          type={INPUT_TYPE.CODE}
          register={register('code', { required: '请输入验证码' })}
          error={errors.code?.message}
        />

        <input
          type="submit"
          className="mt-[40px] flex h-[50px] w-full items-center justify-center rounded-[7px]
           bg-[#0e67ff] text-[18px] text-[#fff]"
          value="登录"
        />
      </form>
      <div className="flex w-full justify-end">
        <LanguageBtns />
      </div>
    </section>
  );
};

export default LoginForm;
