import './login-form-item.scss';

function LoginFormItem({ error, icon, children }) {
  return (
    <div className={`
      relative mb-[18px] flex flex-1 flex-wrap items-center border-b-[1px]
      border-[var(--color-border-light)] pb-[18px]
    `}
    >
      {icon && <img src={icon} alt="" className="h-[22px] w-[22px]" />}
      {children}

      {error && (
        <span className="left-0 absolute bottom-[-3px] text-[14px] text-[var(--color-danger)]">
          {error}
        </span>
      )}
    </div>
  );
}

export default LoginFormItem;
