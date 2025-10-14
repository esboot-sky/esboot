import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button } from 'rsuite';
import CheckIcon from '@/images/check.svg';
import CheckIcon2 from '@/images/check.svg?url';
import { genericMemo } from '@/utils/react-utils';
import './index.scss';
import { supportedLanguage } from "@/constants/config";
import { useMinimalAppDispatch } from '@pc/model/minimal-store';
import { setLanguage } from '@pc/model/app/slice';

const xcls = 'text-bold font-bold m-5';
console.log(xcls);

const Index = genericMemo(() => {
  const dispatch = useMinimalAppDispatch();

  const changeLanguageToEn = () => {
    dispatch(setLanguage(supportedLanguage.EN_US));
  };

  const changeLanguageToZh = () => {
    dispatch(setLanguage(supportedLanguage.ZH_CN));
  };

  const changeLanguageToZhTw = () => {
    dispatch(setLanguage(supportedLanguage.ZH_TW));
  };
  return (
    <div>
      <Link
        style={{
          fontSize: 16,
        }}
        to="/detail"
      >
        go to detail
      </Link>

      <div>
        <Button onClick={changeLanguageToEn}>
          Change to English
        </Button>

        <Button onClick={changeLanguageToZh}>
          Change to Chinese
        </Button>

        <Button onClick={changeLanguageToZhTw}>
          Change to Chinese (Traditional)
        </Button>

        <p>
          <FormattedMessage id="test2.title" />
        </p>
      </div>

      <CheckIcon width={100} height={100} />
      <img src={CheckIcon2} alt="" className="h-10 w-10" />
      <img src="/static/logo.png" alt="" />

      <div styleName="w375" className="text-bold m-5 p-5 text-red-500">
        375 width in 750 design
      </div>
    </div>
  );
});

export default Index;
