import type { Control, UseFormRegisterReturn } from 'react-hook-form';

import InputCode from './input-code';
import InputPassword from './input-password';
import { INPUT_TYPE } from './types';

interface InputProps {
  name: string;
  placeholder: string;
  icon: string;
  register: UseFormRegisterReturn<string>;
  error?: string;
  type?: INPUT_TYPE;
  control?: Control<any, any>;
}

const inputComponentsDict: Record<INPUT_TYPE, React.ComponentType<any>> = {
  [INPUT_TYPE.PASSWORD]: InputPassword,
  [INPUT_TYPE.CODE]: InputCode,
};

function FormInputItem({ register, error, icon, placeholder, type, control }: InputProps) {
  const Component = type ? inputComponentsDict[type] : null;

  return (
    <div className="
      relative mbe-[18px] flex flex-1 flex-wrap items-center border-be border-[#ebebeb] pbe-[18px]
    "
    >
      <img src={icon} alt="" className="block-[22px] inline-[22px]" />
      {Component
        ? (
            <Component register={register} placeholder={placeholder} control={control} />
          )
        : (
            <input
              {...register}
              placeholder={placeholder}
              className="
                flex-1 px-[11px] block-[30px]
                placeholder:text-[#a8abb2]
                focus-visible:outline-none
              "
            />
          )}

      {error && <span className="left-0 absolute inset-be-[-3px] text-[14px] text-[#f56c6c]">{error}</span>}
    </div>
  );
}

export default FormInputItem;
