import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { About } from "./pages/About";
import { Home } from "./pages/Home";
import { ProjectView } from "./pages/ProjectView";
import { Registry } from "./pages/Registry";
import { Submit } from "./pages/Submit";

// Root layout with shared Navbar
function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "bg-[#0f0f11] border border-white/[0.1] text-white shadow-xl",
            description: "text-zinc-400",
          },
        }}
      />
    </>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/submit",
  component: Submit,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/project/$id",
  component: ProjectView,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const registryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/registry",
  component: Registry,
});

// Route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  submitRoute,
  projectRoute,
  aboutRoute,
  registryRoute,
]);

// Router
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Type augmentation
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
