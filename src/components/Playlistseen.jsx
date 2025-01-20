import React, {useState, useEffect} from "react";
import PlaylistViewer from "./PlaylistViewer";
import { selectAuth } from "../features/tokenSlice.js";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Playlistseen() {

  const [user, setUser] = useState({});
  const { token } = useSelector(selectAuth);

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

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);


  return (
    <div className="px-3 sm:px-5 my-5 w-full">
      <h1 className="text-2xl md:text-4xl font-roboto font-bold mb-6">
        Playlists
      </h1>
      <div
        id="id1"
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:h-[calc(100vh-192.2px)] overflow-y-auto lg:grid-cols-3 2xl:grid-cols-4 gap-4 "
      >
        {user?.playlists?.map((cat, index) => {
          return (
            <PlaylistViewer key={index} name={cat.name} date={cat.created} />
          );
        })}
      </div>
    </div>
  );
}
