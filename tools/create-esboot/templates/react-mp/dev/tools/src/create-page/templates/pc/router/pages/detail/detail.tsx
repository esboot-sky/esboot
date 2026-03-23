import { Button } from 'antd-mobile';
import useHelloStore, { increase, selectCount } from '../../model/hello';

function Detail() {
  const count = useHelloStore(selectCount);

  return (
    <div>
      detail
      {count}
      <Button onClick={() => increase(1)}>increase</Button>
    </div>
  );
}

export default Detail;
