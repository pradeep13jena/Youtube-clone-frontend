// Home component which render first when entering into the websites
import React, { useEffect, useState } from "react";
import Homeviewer from "./Homeviewer.jsx";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/tokenSlice.js";
import { Link } from "react-router-dom";

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

export default function Home() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [videos, setVideos] = useState([]);
  const { token } = useSelector(selectAuth);
  const text = useSelector((state) => state.searchbar.text);

  useEffect(() => {
    if (token !== null) {
      axios
        .get("http://localhost:5000/videos", {
          headers: {
            Authorization: `JWT ${token}`,
          },
        })
        .then((data) => {
          setVideos(data.data);
        })
        .catch((err) => {
          console.log(err);
        });

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
    }
  }, [token]);

  const [Genre, setGenre] = useState([]);
  const [genreSearch, setGenreSearch] = useState("");

  useEffect(() => {
    const allCategories = videos?.reduce(
      (acc, video) => {
        if (video.categories) {
          return [...acc, ...video.categories];
        }
        return acc;
      },
      ["All"]
    );

    const uni = new Set(allCategories);

    setGenre([...uni] || []);
  }, [videos]);

  const genreSelected = (cat) => {
    if (cat === "All") {
      setGenreSearch("");
    } else {
      setGenreSearch(cat);
    }
  };

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
        <div className="flex flex-col px-0 sm:px-5 justify-start pb-2 md:pb-0 w-full overflow-y-auto z-30">
          <div
            id="id1"
            className="flex items-center justify-start gap-2 py-2 w-full min-w-0 overflow-x-auto bg-white sticky top-0 z-50"
          >
            {Genre?.map((cat, index) => (
              <div
                key={index}
                className={`shrink-0 min-w-max px-2 py-1 mb-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer`}
              >
                <p
                  onClick={() => genreSelected(cat)}
                  className={`font-medium `}
                >
                  {cat}
                </p>
              </div>
            ))}
          </div>

          {/* Body Section */}
          <div
            id="id1"
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:h-[calc(100vh-126px)] overflow-y-auto lg:grid-cols-3 2xl:grid-cols-4 gap-4"
          >
            {videos && videos.length > 0 ? (
              (() => {
                const filteredVideos = videos.filter((cat) => {
                  const matchesGenre =
                    !genreSearch ||
                    cat.categories.some((category) => category === genreSearch);

                  const matchesText =
                    !text ||
                    cat.title?.toLowerCase().includes(text?.toLowerCase()) ||
                    cat.channelName
                      ?.toLowerCase()
                      .includes(text?.toLowerCase());

                  return matchesGenre && matchesText;
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
