import { Link } from 'react-router-dom';

import CheckIcon from '@/images/check.svg';
import CheckIcon2 from '@/images/check.svg?url';
import { genericMemo } from '@/utils/react-utils';
import './index.scss';

const Index = genericMemo(() => {
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
