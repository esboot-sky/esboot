import { RedoOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import useGetCode from '../../hooks/use-get-code';

import './from-input-item.scss';

type InputProps = {
  placeholder: string;
  register: UseFormRegisterReturn<string>;
};

const InputCode = ({ register, placeholder }: InputProps) => {
  const { queryCode, codeUrl } = useGetCode();

  useEffect(() => {
    queryCode();
  }, []);

  return (
    <>
      <input
        {...register}
        placeholder={placeholder}
        className="h-[30px] flex-1 px-[11px] placeholder:text-[#a8abb2] focus-visible:outline-none"
      />

      <img src={codeUrl} alt="" className="mr-[11px] h-[27px] w-[70px]" />
      <RedoOutlined onClick={() => queryCode()} />
    </>
  );
};

export default InputCode;
