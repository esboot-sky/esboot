import type { UseFormRegisterReturn } from 'react-hook-form';
import { RedoOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

import useGetCode from '../../hooks/use-get-code';

interface InputProps {
  placeholder: string;
  register: UseFormRegisterReturn<string>;
}

function InputCode({ register, placeholder }: InputProps) {
  const { queryCode, codeUrl } = useGetCode();

  useEffect(() => {
    queryCode();
  }, [queryCode]);

  return (
    <>
      <input
        {...register}
        placeholder={placeholder}
        className="
          flex-1 px-[11px] block-[30px]
          placeholder:text-[#a8abb2]
          focus-visible:outline-none
        "
      />

      <img src={codeUrl} alt="" className="me-[11px] block-[27px] inline-[70px]" />
      <RedoOutlined onClick={() => queryCode()} className="cursor-pointer" />
    </>
  );
}

export default InputCode;
