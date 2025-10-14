import { Link } from 'react-router-dom';

import { genericMemo } from '@/utils/react-utils';

// import './index.scss';

const Index = genericMemo(() => {
  return (
    <div>
      <Link
        style={{
          fontSize: 16,
        }}
        to="/detail"
      >
        go to detail1
      </Link>
      <div>375 width in 750 design</div>
    </div>
  );
});

export default Index;
