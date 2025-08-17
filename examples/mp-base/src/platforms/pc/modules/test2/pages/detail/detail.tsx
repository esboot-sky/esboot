import { sayHi } from '@mobile-browser/helpers/multi-platforms';
import { genericMemo } from '@/utils/react-utils';

console.log(sayHi('123'));

const Detail = genericMemo(() => {
  return (
    <div>
      detail
    </div>
  );
});

export default Detail;
