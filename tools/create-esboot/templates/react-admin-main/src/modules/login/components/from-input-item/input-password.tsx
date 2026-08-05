import type { Control, UseFormRegisterReturn } from 'react-hook-form';
import { Input } from 'antd';
import { Controller } from 'react-hook-form';

interface InputProps {
  placeholder: string;
  register: UseFormRegisterReturn<string>;
  control: Control;
}

function InputPassword({ register, placeholder, control }: InputProps) {
  return (
    <Controller
      render={({ field }) => (
        <Input.Password
          {...field}
          placeholder={placeholder}
          className="
            flex-1 border-none text-[18px] block-[30px]
            placeholder:text-[#a8abb2]
            focus-within:shadow-none
          "
        />
      )}
      name={register.name}
      control={control}
    />
  );
}

export default InputPassword;
