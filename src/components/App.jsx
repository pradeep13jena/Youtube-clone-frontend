// App component which integrates different part of the website

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../styles/style.css";
import Appnav from "./Appnav";

export default function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 gap-0">
        <Sidebar />
        <Outlet />
      </div>
      <Appnav />
    </div>
  );
}
