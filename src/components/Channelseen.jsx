import React, {useState, useEffect} from "react";
import ChannelViewer from "./ChannelViewer";
import { Link } from "react-router-dom";
import { selectAuth } from "../features/tokenSlice.js";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Channelseen() {

  const [user, setUser] = useState({});
  const { token } = useSelector(selectAuth);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "https://youtubepradeep.onrender.com/user",
          {},
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );
        setUser(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  return (
    <div className="px-3 sm:px-5 my-5 w-full">
      <h1 className="text-2xl md:text-4xl font-roboto font-bold mb-6">
        Channels
      </h1>
      <div
        id="id1"
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:h-[calc(100vh-162.2px)] overflow-y-auto lg:grid-cols-3 2xl:grid-cols-4 gap-4 "
      >
        {/* {channels.map((cat, index) => {
          return (
            <ChannelViewer             
              key={index}
              thumbnail={cat.thumbnail}
              name={cat.name}
              date={cat.created}
            />
          );
        })} */}
      </div>
    </div>
  );
}
