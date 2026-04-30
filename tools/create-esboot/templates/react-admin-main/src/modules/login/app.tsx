import LoginForm from './components/login-form/login-form';
import Welcome from './images/welcome.png';

function Login() {
  return (
    <div
      className="flex h-full w-full items-center justify-center
      before:inline-block before:h-full before:w-[30%] before:bg-[#ecf7ff] before:content-['']
    after:inline-block after:h-full after:w-[70%] after:bg-[#e1f2ff] after:content-['']
    "
    >
      <div className="absolute left-[30px] top-[30px]">
        <img src="/static/logo.svg" alt="" className="w-[200px]" />
      </div>
      <div
        className="absolute z-[1] flex h-[580px] w-[960px] rounded-[30px]
       bg-[#fdfdfd] shadow-[0px_0px_80px_0px_rgba(44,49,52,.2)]"
      >
        <section
          className="box-border h-full w-[400px] rounded-[30px] pb-[86px] pl-[50px] pt-[101px]
         shadow-[0px_0px_80px_0px_rgba(162,190,210,.3)]"
        >
          <h4 className="text-[24px] font-medium leading-[33px] text-[#333]">Hi，欢迎回来～</h4>
          <h2 className="mb-[55px] mt-[10px] break-words text-[28px] font-medium leading-[53px] text-[#333] ">
            {/* 簿记系统管理平台 */}
          </h2>
          <img src={Welcome} alt="" className="h-[242px] w-[300px]" />
        </section>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
