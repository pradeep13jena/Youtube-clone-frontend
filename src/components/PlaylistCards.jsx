// Child component to render all the videos in the playlist page.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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

export default function PlaylistCards({
  _id,
  thumbnail,
  title,
  channelName,
  views,
}) {
  return (
    <div className="flex-shrink-0 w-60">
      <Link to={`/watch?v=${_id}`}>
        <img
          src={thumbnail}
          alt={title}
          className="rounded-md w-60 h-36 object-cover hover:opacity-70"
        />
      </Link>
      <div className="mt-2 flex justify-between">
        <div>
          <h1 className="text-base font-semibold line-clamp-2">{title}</h1>
          <p className="text-sm text-gray-700">{channelName}</p>
          <p className="text-sm text-gray-700">{formatNumber(views)} views</p>
        </div>
      </div>
    </div>
  );
}
