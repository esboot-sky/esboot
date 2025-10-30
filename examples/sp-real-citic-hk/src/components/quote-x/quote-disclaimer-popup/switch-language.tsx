import { lanEnum } from '@/constants/config';

interface LanguageOption {
  key: string;
  label: string;
  value: string;
}

interface LanguageSwitchProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  options?: LanguageOption[];
}

const LanguageSwitch = ({
  currentLanguage,
  onLanguageChange,
  options = [
    { key: 'zh-CN', label: '简', value: lanEnum.ZH_CN },
    { key: 'zh-TW', label: '繁', value: lanEnum.ZH_TW },
    { key: 'en-US', label: '英', value: lanEnum.EN_US },
  ],
}: LanguageSwitchProps) => {
  return (
    <div className="fixed bottom-8 right-1 flex flex-col rounded-[8px] bg-[#7b7b7b] p-[5px]">
      {options.map((option) => (
        <div
          key={option.key}
          className={`cursor-pointer rounded transition-colors hover:bg-[#ffffff] ${
          currentLanguage === option.value ? 'bg-white font-medium text-[#b8874c]' : 'text-white' }`}
          onClick={() => onLanguageChange(option.value)}
          style={{
            width: '30px',
            height: '30px',
            lineHeight: '30px',
            textAlign: 'center',
            borderRadius: '5px',
            marginBottom: options.indexOf(option) < options.length - 1 ? '5px' : '0',
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default LanguageSwitch;
