// Component responsible for playing the video
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import BookmarkBorderSharpIcon from "@mui/icons-material/BookmarkBorderSharp";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ReplySharpIcon from "@mui/icons-material/ReplySharp";
import WatchSuggestion from "./WatchSuggestion";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../features/tokenSlice.js";
import Comments from "./comments.jsx";
import { render } from "../features/subscriptionslice.js";

const style = {
  border: "1px solid #ddd",
  borderRadius: 3,
  P: 1,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  bgcolor: "background.paper",
  maxWidth: "200px",
  textAlign: "center",
};

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

export default function Watch() {
  const [searchParams] = useSearchParams();
  const _id = searchParams.get("v");
  const { token } = useSelector(selectAuth);

  const [expand, setExpand] = useState(false);
  const [allVideos, setAllVideos] = useState({});
  const [showComment, setShowComment] = useState(false);

  const dispatch = useDispatch();

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
    if (token && _id) {
      // Ensure token and _id are available before making the request
      axios
        .get(`http://localhost:5000/videos/${_id}`, {
          headers: {
            Authorization: `JWT ${token}`,
          },
        })
        .then((response) => {
          setVideos(response.data);
          setComments(response.data.comments);
        })
        .catch((error) => {
          console.error("Error fetching video details:", error);
        });

      axios
        .get("http://localhost:5000/videos", {
          headers: {
            Authorization: `JWT ${token}`,
          },
        })
        .then((data) => {
          setAllVideos(data.data);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get("http://localhost:5000/videos", {
          headers: {
            Authorization: `JWT ${token}`,
          },
        })
        .then((data) => {
          setAllVideos(data.data);
        })
        .catch((err) => {
          console.log(err);
        });

      fetchUserData();
    }
  }, [token, _id]); // Added token and _id as dependencies

  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [videos, setVideos] = useState({});
  const [sub, Setsub] = useState(null);

  useEffect(() => {
    const value = user?.subscriptionDetails?.some(
      (x) => videos?.channelName === x.channelName
    );
    Setsub(value)

  }, [user, videos]);

  // Function to add comment
  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      axios
        .post(
          `http://localhost:5000/comment`,
          {
            id: videos._id,
            comment: newComment,
          },
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        )
        .then((data) => {
          setComments(data.data.comments);
          setNewComment("");
        })
        .catch((err) => console.log(err));
    }
  };

  // Function to like video
  function likeVideo() {
    axios
      .put(
        `http://localhost:5000/like/${_id}`,
        {},
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      )
      .then((data) => {
        console.log(data);
        setVideos((x) => ({
          ...x,
          likes: data.data.video.likes,
        }));
      })
      .catch((err) => console.log(err));

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
  }

  // Function to dislike videos
  function dislikeVideo() {
    axios
      .put(
        `http://localhost:5000/dislike/${_id}`,
        {},
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      )
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  // Functino to handle subscribers
  function handlesub() {
    axios
      .put(
        "http://localhost:5000/subscribe",
        {
          channelName: videos.channelName,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      )
      .then((data) => {
        setVideos((x) => ({
          ...x,
          channelDetails: data.data.channelSubscribersCount,
        }));
        dispatch(render())
        fetchUserData()
      })
      .catch((err) => console.log(err));
  }

  // Funciton to convert the simple date to more readable format
  function convertToNormalDate(isoDate) {
    const date = new Date(isoDate);

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`; // Format as YYYY-MM-DD
  }

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
        <div className="videoWatcher w-full flex flex-col lg:flex-row gap-5 px-0 sm:px-8 py-5 md:h-[calc(100vh-59.2px)] overflow-y-auto">
          <div className="w-full lg:w-[70%] flex flex-col gap-3">
            <div className="videosPlayer lg:rounded-lg relative pt-[54.25%] overflow-hidden">
              <ReactPlayer
                controls={true}
                playing={true}
                light={false}
                url={videos.videoLink}
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            </div>
            <div className="flex flex-col gap-5 w-full px-2 lg:px-0">
              {/* Title with views */}
              <div className="flex flex-col justify-start items-start text-sm gap-1 w-full">
                <h1 className="videoTitle font-roboto text-sm md:text-[1.3rem] font-semibold">
                  {videos.title}
                </h1>
                <p className="text-xs md:text-sm">
                  {formatNumber(videos.views)} views
                </p>
              </div>

              {/* Channel Details and Action */}
              <div className="w-full flex flex-col gap-7 xl:flex xl:flex-row justify-end items-start lg:items-center lg:justify-between">
                {/* Channel name and subscribe */}
                <div className="w-full flex items-center gap-7 lg:justify-start justify-between">
                  {/* CHannel Avatar */}
                  <div className="justify-between lg:justify-start flex items-center gap-3">
                    <div>
                      <Link to={`/channel/${videos.channelDetails?.channelName}`}>
                        <img
                          src={
                            videos &&
                            videos.channelDetails &&
                            videos.channelDetails.channelLogo
                          }
                          className="w-9 h-9 rounded-full"
                        />
                      </Link>
                    </div>
                    <div className="flex flex-col">
                      <Link to={`/channel/${videos.channelDetails?.channelName}`}>
                        <h1 className="font-medium font-roboto">
                          {videos.channelName}
                        </h1>
                      </Link>
                      <p className="text-gray-400 font-roboto text-xs md:text-sm">
                        {videos &&
                          videos.channelDetails &&
                          formatNumber(videos.channelDetails.subscribers)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h1
                      className={`md:px-3 font-medium flex gap-2 items-center py-2 px-3 cursor-pointer rounded-3xl text-xs md:text-base font-roboto hover:opacity-80 duration-500 ${
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
                        <>Subscribe</>
                      )}
                    </h1>
                  </div>
                </div>

                {/* Video Action */}
                <div className="flex items-center justify-start lg:justify-end gap-3 w-full lg:gap-2">
                  <div className="flex items-center">
                    <div
                      onClick={likeVideo}
                      className="flex items-center gap-3 px-2 py-1 md:px-4 md:py-2 bg-gray-200 cursor-pointer hover:bg-gray-300 rounded-tl-3xl rounded-bl-3xl"
                    >
                      {/* {console.log(user.playlists.liked)} */}
                      <ThumbUpAltOutlinedIcon sx={{ fontSize: { xs: 22 } }} />
                      <p className="font-roboto text-xs">
                        {videos ? videos.likes : "..."}
                      </p>
                    </div>
                    <div
                      onClick={dislikeVideo}
                      className="flex items-center gap-3 px-2 py-1 md:px-4 md:py-2 bg-gray-200 cursor-pointer hover:bg-gray-300 rounded-tr-3xl rounded-br-3xl"
                    >
                      <ThumbDownOutlinedIcon sx={{ fontSize: { xs: 22 } }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-3xl bg-gray-200 px-2 py-1 md:px-4 md:py-2 cursor-pointer hover:bg-gray-300">
                    <BookmarkBorderSharpIcon sx={{ fontSize: { xs: 22 } }} />
                    <p className="font-roboto text-xs">Save</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-3xl bg-gray-200 px-2 py-1 md:px-4 md:py-2 cursor-pointer hover:bg-gray-300">
                    <ReplySharpIcon sx={{ fontSize: { xs: 22 } }} />
                    <p className="font-roboto text-xs">Share</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-3xl bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300">
                    <MoreHorizOutlinedIcon sx={{ fontSize: { xs: 22 } }} />
                  </div>
                </div>
              </div>

              {/* Description bar */}
              <div className="p-4 w-full bg-gray-200 rounded-lg">
                <h1 className="text-black font-roboto text-sm font-medium mb-2">
                  {convertToNormalDate(videos.uploadDate)} •{" "}
                  {formatNumber(videos.views)} views
                </h1>
                <p
                  className={`font-roboto text-sm text-gray-700 duration-300 ${
                    expand ? "" : "line-clamp-1"
                  }`}
                >
                  {videos.description}
                </p>
                <p
                  onClick={() => setExpand(!expand)}
                  className="font-roboto text-sm text-black cursor-pointer"
                >
                  {expand ? "less" : "more..."}
                </p>
              </div>
            </div>

            <div
              className={`comments px-2 lg:px-0 flex flex-col gap-4 mb-4
              `}
            >
              <h1 className="text-black text-xl font-bold font-roboto mt-4">
                {comments?.length} Comments
              </h1>
              <div className="">
                {/* Input Section */}
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a public comment..."
                      className="w-full py-1 px-2 border font-roboto border-b-black outline-none rounded-md resize-none"
                      rows={2}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        className={`px-4 py-2 font-medium text-black hover:text-gray-700 ${
                          newComment.trim() === "" && "opacity-0"
                        } `}
                        onClick={() => setNewComment("")}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddComment}
                        className={`ml-2 px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 ${
                          newComment.trim() === "" &&
                          "opacity-0 cursor-not-allowed"
                        }`}
                        disabled={newComment.trim() === ""}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div
                  className={`mt-4 ${
                    showComment ? "" : "h-16 overflow-hidden"
                  }`}
                >
                  {user && comments?.length > 0 ? (
                    comments.map((comment, index) => (
                        <Comments
                          id={comment._id}
                          key={comment._id}
                          user={user}
                          videos={videos}
                          token={token}
                          setComments={setComments}
                          comment={comment}
                        />
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>
              <div
                onClick={() => setShowComment(!showComment)}
                className="w-full text-black flex justify-center"
              >
                {showComment ? "less..." : "more..."}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[30%] grid grid-cols-1 gap-2 sm:gap-3 px-2">
            <h1 className="text-2xl font-roboto font-semibold mb-5">
              Suggested videos
            </h1>
              {allVideos && allVideos.length > 0 ? (
                allVideos.map((cat) => (
                    <WatchSuggestion key={cat._id} cat={cat} />
                ))
              ) : (
                <p>No videos available</p>
              )}
          </div>
        </div>
      )}
    </>
  );
}
