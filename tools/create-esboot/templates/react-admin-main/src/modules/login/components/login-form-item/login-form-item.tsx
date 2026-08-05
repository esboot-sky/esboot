interface LoginFormItemProps {
  error?: string;
  icon?: string;
  children: React.ReactNode;
}

export default function LoginFormItem({ error, icon, children }: LoginFormItemProps) {
  return (
    <div className="
      relative mbe-[18px] flex flex-1 flex-wrap items-center border-be border-[#ebebeb] pbe-[18px]
    "
    >
      {icon && <img src={icon} alt="" className="block-[22px] inline-[22px]" />}
      {children}
      {error && (
        <span className="left-0 absolute inset-be-[-3px] text-[14px] text-[#f56c6c]">
          {error}
        </span>
      )}
    </div>
  );
}
