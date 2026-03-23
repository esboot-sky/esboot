interface IProps {
  children: React.ReactNode;
  label: string;
  errMsg?: string;
  required?: boolean;
}

const BaseFormItem = ({ children, label, errMsg = '', required = false }: IProps) => (
  <div className="flex items-center pb-[20px]">
    <div className="mr-[12px] w-[100px] text-right">
      {required && <span className="mr-[5px] text-[var(--color-danger)]">*</span>}
      {label}
    </div>
    <div className="relative flex-1">
      {children}
      {errMsg && <span className="absolute bottom-[-20px] left-0 text-[14px] text-[var(--color-danger)]">{errMsg}</span>}
    </div>
  </div>
);

export default BaseFormItem;
