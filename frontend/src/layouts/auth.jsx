import { Routes, Route } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/widgets/layout";
import SignIn from "@/pages/Auth/sign-in";  // ✅ Ensure SignIn is imported
import routes from "@/routes";

export function Auth() {
  const navbarRoutes = [
    {
      name: "dashboard",
      path: "/dashboard/home",
      icon: ChartPieIcon,
    },
    {
      name: "profile",
      path: "/dashboard/home",
      icon: UserIcon,
    },
    {
      name: "sign up",
      path: "/auth/sign-up",
      icon: UserPlusIcon,
    },
    {
      name: "sign in",
      path: "/auth/sign-in",
      icon: ArrowRightOnRectangleIcon,
    },
  ];

  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        {/* ✅ Manually add SignIn and SignUp routes */}
        <Route path="/auth/sign-in" element={<SignIn />} />

        {/* ✅ Ensure `routes` properly maps routes */}
        {routes &&
          routes.map(({ layout, pages }) =>
            layout === "auth"
              ? pages.map(({ path, element }) => (
                  <Route key={path} exact path={path} element={element} />
                ))
              : null
          )}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
