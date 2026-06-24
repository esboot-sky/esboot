import { setLanguage, setTheme, usePCStore } from '@pc/model/pc';
import { Button } from 'antd-mobile';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import './index.scss';

function Index() {
  const theme = usePCStore(state => state.userConfig.theme);
  const language = usePCStore(state => state.userConfig.language);

  const changeTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    }
    else {
      setTheme('light');
    }
  };

  const changeLanguage = (lang: 'zh-CN' | 'en-US' | 'zh-TW') => {
    setLanguage(lang);
  };

  return (
    <div>
      <Link
        style={{
          fontSize: 16,
        }}
        to="/detail"
      >
        Go To Detail
      </Link>

      <Button onClick={changeTheme}>Change Theme</Button>

      <div style={{ margin: '10px 0', display: 'flex', gap: '10px' }}>
        <Button onClick={() => changeLanguage('zh-CN')}>简体中文 (zh-CN)</Button>
        <Button onClick={() => changeLanguage('en-US')}>English (en-US)</Button>
        <Button onClick={() => changeLanguage('zh-TW')}>繁體中文 (zh-TW)</Button>
      </div>

      <div className="bg-pink-300 h-[375px] w-[375px]">375 width in 750 design</div>

      <p>
        Theme:
        {theme}
      </p>
      <p>
        Language:
        {language}
      </p>

      <p style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#1677ff' }}>
        I18n Custom Text: <FormattedMessage id="test.custom_text" />
      </p>

      <p styleName="test-stylename">
        I18n Global Text: <FormattedMessage id="global.global_text" />
      </p>
    </div>
  );
};

export default Index;
