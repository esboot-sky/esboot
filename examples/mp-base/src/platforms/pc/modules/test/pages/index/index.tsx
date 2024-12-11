import { Link } from 'react-router-dom';

import { genericMemo } from '@/utils/react-utils';

import './index.scss';

const Index = genericMemo(function Index() {
  return (
    <div>
      <Link
        style={{
          fontSize: 16,
        }}
        to="/detail"
      >
        go to detail2233
        <div className="text-[blue] dark:text-[red]">2432432</div>
      </Link>
      <div styleName="w375" className="text-2xl text-red-500">
        375 width in 750 design
      </div>
    </div>
  );
});

export default Index;
