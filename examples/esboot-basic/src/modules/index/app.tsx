import { Outlet } from 'react-router-dom';

import './app.scss';

const App = () => (
  <div styleName="main">
    Welcome to ESBoot!

    <p className="text-3xl font-bold underline">
      Hello world!
    </p>
    <Outlet />
  </div>
);

export default App;
