// Child component for Home component which renders the videos
import React, { useEffect, useState } from "react";
import { data, Link, useParams } from "react-router-dom";
import axios from "axios";
import { MoreVertOutlined } from "@mui/icons-material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/tokenSlice";
import ShowPLaylist from "../components/ShowPLaylist";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  width: { xs: "90%", sm: "35%", md: "250px" },
  borderRadius: "0.375rem",
  p: 2,
  outline: 0,
};

function formatNumber(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "b";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

const playlist = [
  "Top Hits 2025",
  "Relaxing Vibe",
  "Liked videos",
  "Watch later",
];

export default function Homeviewer(cat) {
  const { token } = useSelector(selectAuth);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleCLick() {
    axios
      .put(
        `http://localhost:5000/playlist/${cat._id}`,
        {
          userName: cat.userD.username,
          playlistName: "Watch Later",
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      )
      .then((data) => console.log(data))
      .catch((data) => console.log(data));
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-[1px] transform transition-transform duration-300">
        <Link to={`/watch?v=${cat._id}`}>
          <img
            src={cat.thumbnail}
            alt=""
            className="md:rounded-lg w-full h-44 sm:h-48 object-cover"
          />
        </Link>
        <div className="flex gap-3 px-2 md:px-0 py-2 justify-start items-start">
          <Link to={`/channel/${cat.channelDetails?.channelName}`}>
            <img
              src={cat.channelDetails?.channelLogo}
              className="w-9 h-9 rounded-full"
              alt=""
            />
          </Link>
          <div className="flex flex-col gap-[.8px] flex-1">
            <h1 className="text-base font-semibold line-clamp-2">
              {cat.title}
            </h1>
            <div className="flex md:flex-col items-center md:items-start">
              <Link to={`/channel/${cat.channelDetails?.channelName}`}>
                <p className="text-gray-700 text-[11px] md:text-[13px]">
                  {cat?.channelDetails?.channelName}
                </p>
              </Link>
              {window.screen.availWidth < 640 ? (
                <p className="text-[10px] px-1 text-gray-500 md:hidden">
                  &#x2022;
                </p>
              ) : (
                ""
              )}
              <div className="flex items-end">
                <p className=" text-gray-700 text-[11px] md:text-[13px]">
                  {formatNumber(cat.views)} views{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="">
            <div
              onClick={() => setOpenModal(!openModal)}
              className="cursor-pointer hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:border-gray-300"
            >
              <MoreVertOutlined className="text-gray-700" />
            </div>
            <div
              className={` bottom-16 right-8 rounded-md shadow-md bg-white ${
                openModal ? "fixed" : "hidden"
              } `}
            >
              <div className="py-1">
                <div className="flex items-center cursor-pointer hover:bg-gray-200 hover:text-black gap-2 px-2 py-2">
                  <WatchLaterOutlinedIcon />
                  <h1 className="text-base font-roboto " onClick={handleCLick}>
                    Add to watch Later
                  </h1>
                </div>
                <div className="flex items-center cursor-pointer hover:bg-gray-200 hover:text-black gap-2 px-2 py-2">
                  <BookmarkBorderOutlinedIcon />
                  <h1 onClick={handleOpen} className="text-base font-roboto ">
                    Save to playlist
                  </h1>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <div className="flex flex-col gap-1 px-3 py-2">
                        <div className="mb-7 flex items-center justify-between">
                          <h1 className="text-2xl font-roboto font-bold">
                            Playlist
                          </h1>
                        </div>
                        {cat &&
                          cat.userD &&
                          cat.userD.playlists &&
                          cat.userD.playlists.map((cata, index) => {
                            return (
                              <ShowPLaylist
                                cat={cat}
                                cata={cata}
                                token={token}
                                key={index}
                              />
                            );
                          })}
                      </div>
                    </Box>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
