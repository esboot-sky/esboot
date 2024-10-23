import loadable from "@loadable/component";

const App = loadable(() => import("./app"));

export default [
  {
    path: "/",
    element: <App />,
  },
];
