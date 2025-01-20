import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { render } from "../features/subscriptionslice";

// Importing child component
import ChannelRender from "./ChannelRender";

import { Link, useParams } from "react-router-dom";

// Material UI
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

// Redux store and management
import { useSelector } from "react-redux";
import { selectAuth } from "../features/tokenSlice";

export default function Channel() {
  const [sub, Setsub] = useState(null);
  const [Expand, setExpand] = useState();
  const [channelDetails, setChannelDetails] = useState({});
  const [user, setUser] = useState({});
  const { token } = useSelector(selectAuth);
  const { channel } = useParams();
  const dispatch = useDispatch()

  function handlesub() {
    axios
      .put(
        "http://localhost:5000/subscribe",
        { channelName: channelDetails.channelName },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      )
      .then((data) => {
        refetchChannelDetails(); // Refetch updated channel details
        refetchUserDetails(); // Refetch updated user details
        dispatch(render())
      })
      .catch((err) => console.error("Error subscribing:", err));
  }

  function refetchChannelDetails() {
    if (token && channel) {
      axios
        .get(`http://localhost:5000/channel/${channel}`, {
          headers: {
            Authorization: `JWT ${token}`,
          },
        })
        .then((response) => {
          setChannelDetails(response.data);
        })
        .catch((error) =>
          console.error("Error fetching channel details:", error)
        );
    }
  }

  function refetchUserDetails() {
    axios
      .post(
        "http://localhost:5000/user",
        {},
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      )
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => console.error("Error fetching user details:", error));
  }

  function formatNumber(num) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "b";
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num;
  }

  useEffect(() => {
    const value = user?.subscriptionDetails?.some(
      (x) => channelDetails?.channelName === x.channelName
    );
    Setsub(value);
  }, [user, channelDetails]);


  useEffect(() => {
    refetchChannelDetails();
    refetchUserDetails()
  }, [token, channel]); // Fetch channel details on mount or when token/channel changes

  return (
    <div className="md:h-[calc(100vh-59.2px)] overflow-y-auto px-3 md:px-24 flex flex-col gap-4 md:gap-7 py-0 w-full">
      {token ? (
        <>
          <div
            className="channelBanner w-full relative"
            style={{ paddingTop: "16.13%" }}
          >
            <img
              src={channelDetails.channelBanner}
              alt="YouTube Banner"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg md:rounded-xl"
            />
          </div>
          <div className="channelDetails w-full flex justify-start items-center gap-3 md:gap-9 mb-5 md:mb-0">
            <img
              src={channelDetails.channelLogo}
              alt={channelDetails.channelName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full md:w-32 md:h-32"
            />
            <div className="flex flex-col md:gap-3">
              <h1 className="text-xl md:text-4xl font-bold font-roboto">
                {channelDetails.channelName}
              </h1>
              <div className="flex flex-col gap-1 items-start justify-start mb-2 md:mb-0">
                <div className="flex items-center gap-0 justify-start">
                  <p className="text-sm text-gray-800">
                    {formatNumber(channelDetails && channelDetails.subscribers)}{" "}
                    subscribers
                  </p>
                  <p className="text-sm px-1 text-gray-800">&#x2022;</p>
                  <p className="text-sm text-gray-800">
                    {channelDetails &&
                      channelDetails.videos &&
                      channelDetails.videos.length}{" "}
                    videos
                  </p>
                </div>
                <p
                  className={`font-roboto text-sm md:text-base font-light text-black duration-300 ${
                    Expand ? "" : "line-clamp-1"
                  }`}
                >
                  {channelDetails.description}
                </p>
                <span
                  onClick={() => setExpand(!Expand)}
                  className="font-roboto text-sm  text-gray-800 cursor-pointer"
                >
                  {Expand ? "less" : "more..."}
                </span>
              </div>
              <div className="flex justify-start items-center">
                <h1
                  className={`md:px-4 flex gap-2 items-center py-2 px-3 cursor-pointer rounded-3xl text-xs md:text-base font-roboto hover:opacity-80 duration-500 ${
                    sub
                      ? "bg-gray-300 text-black flex items-center justify-center"
                      : "  bg-black text-white"
                  }`}
                  onClick={handlesub}
                >
                  {sub ? (
                    <>
                      <NotificationsOutlinedIcon
                        sx={{
                          fontSize: {
                            xs: 16, // Font size for mobile devices
                            sm: 20, // Font size for small screens and above
                          },
                        }}
                      />
                      Subscribed
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </h1>
              </div>
            </div>
          </div>
          <div className="videoList w-full sticky top-0 z-50 bg-white border-b-2">
            <div className="sliderContent pb-0 sm:pb-3 flex justify-between md:justify-start overflow-x-auto gap-6">
              <h1 className="font-roboto text-base font-medium text-black cursor-pointer transition-all">
                Home
              </h1>
              <h1 className="font-roboto text-base font-medium text-gray-700 cursor-pointer transition-all">
                Videos
              </h1>
              <h1 className="font-roboto text-base font-medium text-gray-700 cursor-pointer transition-all">
                Shorts
              </h1>
              <h1 className="font-roboto text-base font-medium text-gray-700 cursor-pointer transition-all">
                Playlists
              </h1>
              <h1 className="font-roboto text-base font-medium text-gray-700 cursor-pointer transition-all">
                Community
              </h1>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-3 sm:gap-4">
            {channelDetails &&
              channelDetails.videoDetails &&
              channelDetails.videoDetails.map((cat, index) => {
                return <ChannelRender key={index} cat={cat} />;
              })}
          </div>
        </>
      ) : (
        <div className="m-auto">
          <Link to={"/signin"}>
            <h1 className="text-base font-roboto font-medium px-3 py-1 bg-gray-100 rounded-full border-[1px] border-black hover:bg-gray-200">
              Login / sign up
            </h1>
          </Link>
        </div>
      )}
    </div>
  );
}
