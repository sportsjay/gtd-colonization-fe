import HomePage from "./components/home";
import LoginPage from "./components/login";
import MapPage from "./components/map";
import UtilsPage from "./components/utils";

export const routes = [
  { id: 0, name: "home", path: "/", component: HomePage },
  { id: 1, name: "login", path: "/login", component: LoginPage },
  { id: 2, name: "map", path: "/map", component: MapPage },
  { id: 3, name: "utils", path: "/utils", component: UtilsPage },
];
