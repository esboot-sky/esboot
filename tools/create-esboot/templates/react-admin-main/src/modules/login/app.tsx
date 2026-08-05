import LoginForm from './components/login-form/login-form';
import Welcome from './images/welcome.png';

function Login() {
  return (
    <div
      className="
        flex items-center justify-center block-full inline-full
        before:inline-block before:bg-[#ecf7ff] before:content-[''] before:block-full
        before:inline-[30%]
        after:inline-block after:bg-[#e1f2ff] after:content-[''] after:block-full after:inline-[70%]
      "
    >
      <div className="absolute inset-s-[30px] inset-bs-[30px]">
        <img src="/static/logo.svg" alt="" className="inline-[200px]" />
      </div>
      <div
        className="
          absolute z-1 flex rounded-[30px] bg-[#fdfdfd] shadow-[0px_0px_80px_0px_rgba(44,49,52,.2)]
          block-[580px] inline-[960px]
        "
      >
        <section
          className="
            box-border rounded-[30px] ps-[50px] pbs-[101px] pbe-[86px]
            shadow-[0px_0px_80px_0px_rgba(162,190,210,.3)] block-full inline-[400px]
          "
        >
          <h4 className="font-medium text-[24px] leading-[33px] text-[#333]">Hi，欢迎回来～</h4>
          <h2 className="
            font-medium mbs-[10px] mbe-[55px] text-[28px] leading-[53px] wrap-break-word text-[#333]
          "
          >
            点证管理中台
          </h2>
          <img src={Welcome} alt="" className="block-[242px] inline-[300px]" />
        </section>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
