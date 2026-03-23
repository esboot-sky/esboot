interface IProps {
  children: React.ReactNode;
  label: string;
  errMsg?: string;
  required?: boolean;
}

function BaseFormItem({ children, label, errMsg = '', required = false }: IProps) {
  return (
    <div className="flex items-center pb-[20px]">
      <div className="mr-[12px] w-[100px] text-right">
        {required && <span className="mr-[5px] text-[var(--color-danger)]">*</span>}
        {label}
      </div>
      <div className="relative flex-1">
        {children}
        {errMsg && (
          <span className="left-0 absolute bottom-[-20px] text-[14px] text-[var(--color-danger)]">
            {errMsg}
          </span>
        )}
      </div>
    </div>
  );
}

export default BaseFormItem;
