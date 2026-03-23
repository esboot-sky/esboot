import { FormattedMessage } from 'react-intl';

import { addPrefixWithBasePath } from '@/helpers/path';
import LoginForm from './components/login-form/login-form';
import Welcome from './images/welcome.png';

const logoSrc = addPrefixWithBasePath('static/logo.svg');

function Login() {
  return (
    <div
      className={`
        flex h-full w-full items-center justify-center
        before:inline-block before:h-full before:w-[30%] before:bg-[var(--login-left-bg)]
        before:content-['']
        after:inline-block after:h-full after:w-[70%] after:bg-[var(--login-right-bg)]
        after:content-['']
      `}
    >
      <div className="absolute top-[30px] left-[30px]">
        <img src={logoSrc} alt="" className="w-[200px]" />
      </div>
      <div
        className={`
          absolute z-[1] flex h-[580px] w-[960px] rounded-[30px] bg-[var(--color-bg-panel)]
          shadow-[0px_0px_80px_0px_rgba(44,49,52,.2)]
        `}
      >
        <section
          className={`
            box-border h-full w-[400px] rounded-[30px] pt-[101px] pb-[86px] pl-[50px]
            shadow-[0px_0px_80px_0px_rgba(162,190,210,.3)]
          `}
        >
          <h4
            className="font-medium text-[24px] leading-[33px] text-[var(--color-text-primary)]"
            data-testid="hi-welcome-back"
          >
            {' '}
            <FormattedMessage id="login.hi_welcome_back" />
          </h4>
          <h2 className={`
            font-medium mt-[10px] mb-[55px] text-[28px] leading-[53px] break-words
            text-[var(--color-text-primary)]
          `}
          >
            <FormattedMessage id="login.management_platform" />
          </h2>
          <img src={Welcome} alt="" className="h-[242px] w-[300px]" />
        </section>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
