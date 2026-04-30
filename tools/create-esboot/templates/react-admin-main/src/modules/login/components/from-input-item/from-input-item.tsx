import { useMemo } from 'react';
import { Control, UseFormRegisterReturn } from 'react-hook-form';

import InputCode from './input-code';
import InputPassword from './input-password';

export enum INPUT_TYPE {
  PASSWORD = 'password',
  CODE = 'code',
}

type InputProps = {
  name: string;
  placeholder: string;
  icon: string;
  register: UseFormRegisterReturn<string>;
  error?: string;
  type?: INPUT_TYPE | undefined;
  control?: Control<any, any>;
};

const inputComponentsDict = {
  [INPUT_TYPE.PASSWORD]: InputPassword,
  [INPUT_TYPE.CODE]: InputCode,
};

const FromInputItem = ({ register, error, icon, placeholder, type, control }: InputProps) => {
  const Component = useMemo(() => inputComponentsDict[type as INPUT_TYPE], []);

  return (
    <div
      className="relative mb-[18px] flex flex-1 flex-wrap items-center
        border-b-[1px] border-[#ebebeb] pb-[18px]"
    >
      <img src={icon} alt="" className="h-[22px] w-[22px]" />
      {Component ? (
        <Component register={register} placeholder={placeholder} control={control as Control} />
      ) : (
        <input
          {...register}
          placeholder={placeholder}
          className="h-[30px]  flex-1 px-[11px] placeholder:text-[#a8abb2] focus-visible:outline-none "
        />
      )}

      {error && <span className="absolute bottom-[-3px] left-0 text-[14px] text-[#f56c6c]">{error}</span>}
    </div>
  );
};

export default FromInputItem;
