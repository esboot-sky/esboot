interface IProps {
  children: React.ReactNode;
  label: string;
  errMsg?: string;
  required?: boolean;
}

function BaseFormItem({ children, label, errMsg = '', required = false }: IProps) {
  return (
    <div className="flex items-center pbe-[20px]">
      <div className="me-[12px] text-end inline-[100px]">
        {required && <span className="me-[5px] text-(--color-danger)">*</span>}
        {label}
      </div>
      <div className="relative flex-1">
        {children}
        {errMsg && (
          <span className="left-0 absolute inset-be-[-20px] text-[14px] text-(--color-danger)">
            {errMsg}
          </span>
        )}
      </div>
    </div>
  );
}

export default BaseFormItem;
