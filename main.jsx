import { createRoot } from "react-dom/client";
import React, { lazy, Suspense } from "react";

// Primary components
import App from "./src/components/App";
import Home from "./src/components/Home";

// Secondary components
const Playlist = lazy(() => import("./src/components/Playlist"));
const Channel = lazy(() => import("./src/components/Channel"));
const Watch = lazy(() => import("./src/components/Watch"));
const Account = lazy(() => import("./src/components/Account"));
const Subscription = lazy(() => import("./src/components/Subscription"));
const Playlistseen = lazy(() => import("./src/components/Playlistseen"));
const Channelseen = lazy(() => import("./src/components/Channelseen"));
const ChannelOwner = lazy(() => import("./src/components/ChannelOwner"));
const Signin = lazy(() => import("./src/components/Signin"));

// Just in case components
import ErrorPage from "./src/components/ErrorPage";
import LoadingPage from "./src/components/LoadingPage";

// CSS Page
import "./src/styles/index.css";

// React router dom Import
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Redux Import
import { store } from "./src/features/store";
import { Provider } from "react-redux";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/watch",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Watch />
          </Suspense>
        ),
      },
      {
        path: "/channel/:channel",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Channel />
          </Suspense>
        ),
      },
      {
        path: "/feed/playlists",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Playlistseen />
          </Suspense>
        ),
      },
      {
        path: "/feed/channels",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Channelseen />
          </Suspense>
        ),
      },
      {
        path: "/feed/subscriptions",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Subscription />
          </Suspense>
        ),
      },
      {
        path: "/playlist/:playlist",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Playlist />
          </Suspense>
        ),
      },
      {
        path: "/feed/you",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Account />
          </Suspense>
        ),
      },
      {
        path: "/owner/:channel",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <ChannelOwner />
          </Suspense>
        ),
      },
      {
        path: "/signin",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Signin />
          </Suspense>
        ),
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
