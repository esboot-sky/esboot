import IconCheck from '@/images/check.svg';

export const getRadioIcon = ({ checked }: { checked: boolean }) => {
  return checked ? (
    <IconCheck className="h-[36px] w-[36px]" />
  ) : (
    <div className="h-[36px] w-[36px] rounded-full border-[3px] border-[#888]" />
  );
};
