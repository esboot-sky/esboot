import { Link } from 'react-router';

function Index() {
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

      <div className="bg-pink-300 h-[375px] w-[375px]">375 width in 750 design</div>
    </div>
  );
};

export default Index;
