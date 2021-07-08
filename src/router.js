import HomePage from "./components/home";
import LoginPage from "./components/login";
import MapPage from "./components/map";
import ViewerPage from "./components/viewer";

export const routes = [
  { id: 0, name: "Home", path: "/", component: HomePage, isPrivate: false },
  {
    id: 1,
    name: "login",
    path: "/login",
    component: LoginPage,
    isPrivate: false,
  },
  { id: 2, name: "Map", path: "/map", component: MapPage, isPrivate: true },
  {
    id: 3,
    name: "Viewer",
    path: "/viewer",
    component: ViewerPage,
    isPrivate: false,
  },
];
