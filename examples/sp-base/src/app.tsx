import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Outlet />
  );
}

function test(a: string) {
  if (a === '123') return '123';
}

test('123');

export default App;
