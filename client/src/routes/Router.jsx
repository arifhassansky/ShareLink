import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Login from "../pages/Login";
import CreateLink from "../pages/CreateLink";
import Home from "../pages/Home/Home";
import MySharedLinks from "../pages/MySharedLinks";
import LinkDetails from "../pages/LinkDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/create-link",
        element: <CreateLink />,
      },
      {
        path: "/my-links",
        element: <MySharedLinks />,
      },
      {
        path: "/link-details/:id",
        element: <LinkDetails />,
      },
    ],
  },
]);
export default router;
