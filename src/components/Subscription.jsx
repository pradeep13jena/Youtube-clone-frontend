// Component to display the subscribed channel

import React, { useState, useEffect } from "react";
import Homeviewer from "./Homeviewer";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/tokenSlice.js";
import { Link } from "react-router-dom";

export default function Subscription() {
  const [user, setUser] = useState({});
  const [videos, setVideos] = useState({});
  const { token } = useSelector(selectAuth);
  const text = useSelector((state) => state.searchbar.text);

  useEffect(() => {
    if (token !== null) {
      // Function to handle axios requests
      const fetchData = async (url, method = "GET", body = {}) => {
        try {
          const response = await axios({
            method: method,
            url: url,
            data: body,
            headers: {
              Authorization: `JWT ${token}`,
            },
          });
          return response.data;
        } catch (error) {
          console.error(error);
        }
      };

      // Fetch user data
      fetchData("http://localhost:5000/user", "POST")
        .then((userData) => setUser(userData))
        .catch((error) => console.error("Error fetching user data:", error));

      // Fetch videos data
      fetchData("http://localhost:5000/videos")
        .then((videoData) => {
          setVideos(videoData);
        })
        .catch((error) => console.error("Error fetching videos data:", error));
    }
  }, [token]);

  return (
    <>
      {!token ? (
        <div className="m-auto">
          <Link to={"/signin"}>
            <h1 className="text-base font-roboto font-medium px-3 py-1 bg-gray-100 rounded-full border-[1px] border-black hover:bg-gray-200">
              Login / sign up
            </h1>
          </Link>
        </div>
      ) : (
        <div className="z-0 flex flex-col px-0 sm:px-5 justify-start pb-2 md:pb-0 w-full overflow-y-auto">
          {/* Labels */}
          <div className="w-full md:mt-7 md:mb-5">
            <div
              id="id1"
              className="flex items-center justify-start gap-5 px-2 py-2 w-full min-w-0 overflow-x-auto bg-white sticky top-0 z-50"
            >
              {user &&
                user.subscriptionDetails &&
                user.subscriptionDetails.map((cat, index) => (
                  <Link
                    className="flex-shrink-0"
                    key={index}
                    to={`/channel/${cat.channelName}`}
                  >
                    <div className=" flex flex-col justify-center items-center gap-1">
                      <img
                        src={cat.channelLogo}
                        alt={cat.channelName}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full"
                      />
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* Content */}
          <div
            id="id1"
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:h-[calc(100vh-172px)] overflow-y-auto lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4 md:mt-0"
          >
            {videos && videos.length > 0 ? (
              (() => {
                const filteredVideos = videos.filter((cat) => {
                  const matchesText =
                    !text ||
                    cat.title?.toLowerCase().includes(text?.toLowerCase()) ||
                    cat.channelName
                      ?.toLowerCase()
                      .includes(text?.toLowerCase());

                  return matchesText;
                });

                return filteredVideos.length > 0 ? (
                  filteredVideos.map((cat) => (
                    <Homeviewer
                      key={cat._id}
                      userD={user}
                      _id={cat._id}
                      thumbnail={cat.thumbnail}
                      title={cat.title}
                      views={cat.views}
                      channelDetails={cat.channelDetails}
                    />
                  ))
                ) : (
                  <p>No videos match your search.</p>
                );
              })()
            ) : (
              <p>No videos available.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
