import { Outlet } from 'react-router-dom';

import './app.scss';

const App = () => (
  <div styleName="main">
    PC Browser Platform

    <Outlet />
  </div>
);

export default App;
