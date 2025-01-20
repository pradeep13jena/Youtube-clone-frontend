// Component which manages the sidebar and it is entirely different component and button for this is
// handeled in header component, so to manages the sidebar from the header component and for this i have use
// Redux
import React, { useState, useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import AccessTimeSharpIcon from "@mui/icons-material/AccessTimeSharp";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { selectAuth } from "../features/tokenSlice";

export default function Sidebar() {
  const isToggle = useSelector((state) => state.sidebar.isVisible);
  const render = useSelector((state) => state.subscription.subscriptionList);
  const { token } = useSelector(selectAuth);

  const menuItem = [
    {
      navigate: "/",
      icons: <HomeOutlinedIcon sx={{ fontSize: 25 }} />,
      label: "Home",
    },
    {
      navigate: "/feed/subscriptions",
      icons: <SubscriptionsOutlinedIcon sx={{ fontSize: 25 }} />,
      label: "Subscription",
    },
    {
      navigate: "/playlist/Watch Later",
      icons: <AccessTimeSharpIcon sx={{ fontSize: 25 }} />,
      label: "Watch later",
    },
    {
      navigate: "/playlist/Liked Videos",
      icons: <ThumbUpAltOutlinedIcon sx={{ fontSize: 25 }} />,
      label: "Liked vidoes",
    },
    {
      navigate: "/feed/you",
      icons: <AccountCircleOutlinedIcon sx={{ fontSize: 25 }} />,
      label: "You",
    },
  ];

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/user",
          {},
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [render]);

  return (
    <nav
      className={`hidden ${
        isToggle ? "w-[18rem]" : "w-20"
      } divide-y-2 md:flex gap-5 mt-2 md:h-[calc(100vh-66.2px)] md:flex-col items-start p-2 md:bg-white overflow-y-auto`}
    >
      {/* First */}
      <ul className="flex flex-col gap-2 w-full">
        {menuItem.map((cat, index) => {
          return (
            <Link key={index} to={cat.navigate}>
              <li
                className={` ${
                  isToggle ? "flex px-4" : "flex flex-col gap-[.8em] px-[2px]"
                } py-2 rounded-md cursor-pointer gap-5 items-center hover:bg-gray-100`}
              >
                <div>{cat.icons}</div>
                <p
                  className={`flex-1 ${
                    isToggle ? "text-sm  font-normal" : "text-[10px]"
                  }`}
                >
                  {cat.label}
                </p>
              </li>
            </Link>
          );
        })}
      </ul>

      {/* Second */}
      <div
        className={` ${
          isToggle ? "" : "hidden"
        } py-3 w-full flex flex-col gap-2`}
      >
        <h1 className="font-roboto font-medium text-[1.1rem] px-4 ">
          Subscriptions
        </h1>
        <ul className="flex flex-col gap-1">
          {token ? (
            user.subscriptionDetails && user.subscriptionDetails.length > 0 ? (
              user.subscriptionDetails.map((cat, index) => (
                <Link key={index} to={`/channel/${cat.channelName}`}>
                  <li className="flex gap-3 items-center cursor-pointer hover:bg-gray-200 px-4 py-2 rounded-md">
                    <img
                      src={cat.channelLogo}
                      alt={`${cat.channelName} Logo`}
                      className="w-7 h-7 rounded-full"
                    />
                    <p className="truncate text-sm">{cat.channelName}</p>
                  </li>
                </Link>
              ))
            ) : (
              <p className="mt-3 text-sm font-roboto px-4">
                Subscribe channels to see here...
              </p>
            )
          ) : (
            <p className="mt-3 text-sm font-roboto px-4">
              sign in to see subscribed channels
            </p>
          )}
        </ul>
      </div>
    </nav>
  );
}
