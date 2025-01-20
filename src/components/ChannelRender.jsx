import React, { useState } from "react";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { MoreVertOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

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

export default function ChannelRender({ cat }) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="flex md:flex-col sm:gap-[1px] transform transition-transform duration-300">
        <Link to={`/watch?v=${cat._id}`}>
          <img
            src={cat.thumbnail}
            alt=""
            className="md:rounded-lg md:w-full h-24 sm:h-40 md:h-48 object-cover"
          />
        </Link>
        <div className="flex gap-3 pl-2 py-2 flex-1 justify-between items-start">
          <div className="flex flex-col gap-[.8px] flex-1">
            <h1 className="text-sm sm:text-base font-semibold line-clamp-2">
              {cat.title}
            </h1>
            <div className="flex md:flex-col items-center justify-between md:items-start">
              <div className="flex-col sm:flex items-end">
                <p className=" text-gray-700 text-[10px] md:text-[13px]">
                  {formatNumber(cat.views)} views{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="">
            <div
              onClick={() => setOpenModal(!openModal)}
              className="cursor-pointer hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-end sm:justify-center hover:border-gray-300"
            >
              <MoreVertOutlined className="text-gray-700" />
            </div>
            <div
              className={` bottom-16 right-8 rounded-md shadow-md bg-white hidden`}
            >
              <div className="py-1">
                <div className="flex items-center cursor-pointer hover:bg-gray-200 hover:text-black gap-2 px-2 py-2">
                  <WatchLaterOutlinedIcon />
                  <h1 className="text-base font-roboto ">Add to watch Later</h1>
                </div>
                <div className="flex items-center cursor-pointer hover:bg-gray-200 hover:text-black gap-2 px-2 py-2">
                  <BookmarkBorderOutlinedIcon />
                  <h1 className="text-base font-roboto ">Save to playlist</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
