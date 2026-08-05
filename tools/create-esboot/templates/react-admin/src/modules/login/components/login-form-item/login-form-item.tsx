import './login-form-item.scss';

function LoginFormItem({ error, icon, children }) {
  return (
    <div className={`
      relative mbe-[18px] flex flex-1 flex-wrap items-center border-be border-(--color-border-light)
      pbe-[18px]
    `}
    >
      {icon && <img src={icon} alt="" className="block-[22px] inline-[22px]" />}
      {children}

      {error && (
        <span className="left-0 absolute inset-be-[-3px] text-[14px] text-(--color-danger)">
          {error}
        </span>
      )}
    </div>
  );
}

export default LoginFormItem;
