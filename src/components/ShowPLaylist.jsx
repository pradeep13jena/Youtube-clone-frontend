// PlaylistsComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowPLaylist = ({ cat, cata, token }) => {
  const [isChecked, setChecked] = useState(
    cata.videos.some((video) => video._id === cat._id)
  );

  function handleChange(e) {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    axios
      .put(
        `http://localhost:5000/playlist/${cat._id}`,
        {
          userName: cat.userD.username,
          playlistName: cata.name,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      )
      .then((data) => data)
      .catch((data) => console.log(data));
  }

  return (
    <div className="flex w-full items-center justify-start gap-6">
      <input
        checked={isChecked}
        className="w-4 h-4"
        type="checkbox"
        value={cata.name}
        name={cata.name}
        id={cata.name}
        onChange={handleChange}
      />
      <label className="text-lg cursor-pointer font-roboto" htmlFor={cata.name}>
        {cata.name}
      </label>
    </div>
  );
};

export default ShowPLaylist;
