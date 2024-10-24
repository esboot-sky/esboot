import { Outlet } from "react-router-dom";

function Test() {
  return (
    <div>
      <div className="text-2xl">
        <h1>Hello, ESBoot!</h1>
      </div>
      <Outlet />
    </div>
  );
}

export default Test;
