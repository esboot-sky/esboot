import { Input } from 'antd';
import { UseFormRegisterReturn, Controller, Control } from 'react-hook-form';

import './from-input-item.scss';

type InputProps = {
  placeholder: string;
  register: UseFormRegisterReturn<string>;
  control: Control;
};

const InputPassword = ({ register, placeholder, control }: InputProps) => {
  return (
    <Controller
      render={({ field }) => (
        <Input.Password
          {...field}
          placeholder={placeholder}
          className="h-[30px] flex-1 border-none text-[18px] focus-within:shadow-none "
        />
      )}
      name={register.name}
      control={control}
    />
  );
};

export default InputPassword;
