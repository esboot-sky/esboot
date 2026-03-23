import { setLanguage, setTheme, usePCStore } from '@pc/model/pc';
import { Button } from 'antd-mobile';
import { Link } from 'react-router';

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

  const changeLanguage = () => {
    if (language === 'zh-CN') {
      setLanguage('en-US');
    }
    else {
      setLanguage('zh-CN');
    }
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
      <Button onClick={changeLanguage}>Change Language</Button>
      <div className="bg-pink-300 h-[375px] w-[375px]">375 width in 750 design</div>

      <p>
        Theme:
        {theme}
      </p>
      <p>
        Language:
        {language}
      </p>
    </div>
  );
};

export default Index;
