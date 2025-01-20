// Standalone page for rendering the playlist page
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/tokenSlice.js";
import PlaylistRender from "./PlaylistRender";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Playlist() {
  const { playlist } = useParams();
  const { token } = useSelector(selectAuth);
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

    fetchUserData();
  }, []);

  return (
    <div className="sm:px-5 my-5 w-full">
      {!token ? (
        <Link
          to={"/signin"}
          className="md:h-[calc(100vh-210px)] flex justify-center items-center"
        >
          <h1 className="text-base font-roboto font-medium px-3 py-1 w-fit mx-auto  bg-gray-100 rounded-full border-[1px] border-black hover:bg-gray-200">
            Login / sign up
          </h1>
        </Link>
      ) : (
        <>
          <h1 className="text-2xl md:text-3xl font-roboto font-bold mb-6 md:my-10 px-3">
            {playlist}
          </h1>
          <div
            id="id1"
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:h-[calc(100vh-173.2px)] overflow-y-auto lg:grid-cols-3 2xl:grid-cols-4 gap-4 "
          >
            {user &&
              user.playlists &&
              user.playlists
                .filter(
                  (cat) => cat.name.toLowerCase() === playlist.toLowerCase()
                )
                .map((cat, index) =>
                  cat.videos.length > 0 ? (
                    cat.videos.map((video, videoIndex) => (
                      <PlaylistRender
                        video={video}
                        user={user}
                        token={token}
                        playlistName={playlist}
                        key={videoIndex}
                        thumbnail={video.thumbnail}
                        title={video.title}
                        channelName={video.channelName}
                        views={video.views}
                        setUser={setUser}
                      />
                    ))
                  ) : (
                    <p key={index}>No videos available in this playlist...</p>
                  )
                )}
          </div>
        </>
      )}
    </div>
  );
}
