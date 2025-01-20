import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { MoreVertOutlined, VaccinesTwoTone } from "@mui/icons-material";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Homeviewer(cat) {
  function handleCLick() {
    axios
      .put(
        `http://localhost:5000/playlist/${cat.video._id}`,
        {
          userName: cat.user.username,
          playlistName: cat.playlistName,
        },
        {
          headers: {
            Authorization: `JWT ${cat.token}`,
          },
        }
      )
      .then((data) => {cat.setUser(data.data.userDetails)})
      .catch((data) => console.log(data));
  }

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-[1px] transform transition-transform duration-300">
        <Link to={`/watch?v=${cat.video._id}`}>
          <img
            src={cat.thumbnail}
            alt=""
            className="md:rounded-lg w-full h-44 sm:h-48 object-cover"
          />
        </Link>
        <div className="flex gap-3 px-2 md:px-0 py-2 justify-start items-start">
          <div className="flex flex-col gap-[.8px] flex-1">
            <h1 className="text-base font-semibold">{cat.title}</h1>
            <div className="flex md:flex-col items-center md:items-start">
              <p className="text-gray-700 text-[11px] md:text-[13px]">
                {cat.channelName}
              </p>
              {window.screen.availWidth < 640 ? (
                <p className="text-[10px] px-1 text-gray-500 md:hidden">
                  &#x2022;
                </p>
              ) : (
                ""
              )}
              <div className="flex items-end">
                <p className=" text-gray-700 text-[11px] md:text-[13px]">
                  {cat.views} views{" "}
                </p>
                <p className="text-[10px] px-1 text-gray-500">&#x2022;</p>
                <p className=" text-gray-700 text-[11px] md:text-[13px]">
                  {cat.views} views{" "}
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
                  <h1 className="text-base font-roboto" onClick={handleCLick}>
                    Remove from playlist
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
