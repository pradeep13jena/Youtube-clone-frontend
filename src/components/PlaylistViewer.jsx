// To display the playlist videos
import { MoreVertOutlined } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function PlaylistViewer(Props) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex flex-col gap-[1px] transform transition-transform duration-300">
      <Link to={`/playlist/${Props.name}`}>
        <img
          src="https://ik.imagekit.io/kf28wicizj/Youtube/playlist.jpg?updatedAt=1736162630427"
          className="w-full object-cover"
          alt=""
        />
      </Link>
      <div className="px-2 md:px-0 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">{Props.name}</h1>
          <p className="text-gray-700 text-[11px] md:text-[13px]">
            {Props.date}
          </p>
        </div>
        <div className="relative">
          <div className="cursor-pointer hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:border-gray-300">
            <MoreVertOutlined
              onClick={() => setOpenModal(!openModal)}
              className="text-gray-700"
            />
          </div>
          <div
            className={` top-56 right-6 rounded-md shadow-md bg-white ${
              openModal ? "fixed" : "hidden"
            } `}
          >
            <div className="py-1">
              <div
                className="flex items-center cursor-pointer hover:bg-gray-200 hover:text-black gap-2 px-2 py-2"
              >
                <DeleteOutlineOutlinedIcon />
                <h1 className="text-base font-roboto ">Delete Playlist</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
