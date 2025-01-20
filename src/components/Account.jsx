import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectAuth } from "../features/tokenSlice.js";
import PlaylistCards from "./PlaylistCards";

// Material UI
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Styles for Modal box
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  width: { xs: "90%", sm: "50%", md: "500px" },
  borderRadius: "0.375rem",
  p: 2,
  outline: 0,
};

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  width: { xs: "90%", sm: "35%", md: "500px" },
  borderRadius: "0.375rem",
  p: 2,
  outline: 0,
};

export default function Account() {

  // UseState for modal boxes
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const [user, setUser] = useState({});
  const { token } = useSelector(selectAuth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [popprOpen, setPoppropen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setPoppropen((prev) => !prev);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "https://youtubepradeep.onrender.com/user",
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
  }, [token]);
  const id = popprOpen ? "simple-popper" : undefined;

  // Starting of Form for channel creation and playlist creation
  const initialValue = {
    channelName: "",
    channelLogo: "",
    channelBanner: "",
    channelDescp: "",
  };

  const initialValue1 = {
    playlistName: "",
  };

  const [channelValues, setChannelValues] = useState(initialValue);
  const [channelError, setChannelError] = useState({});

  const [playlistValues, setPLaylistValues] = useState(initialValue1);
  const [playlistError, setPlaylistError] = useState({});

  function handleChannelChange(e) {
    const { name, value } = e.target;
    setChannelValues({ ...channelValues, [name]: value });
  }

  function handlePlaylistChange(e) {
    const { name, value } = e.target;
    setPLaylistValues({ ...playlistValues, [name]: value });
  }

  function handleChannelValidate(values) {
    const errors = {};
    const imageReg = /^(http|https):\/\/[^\s]+$/;
    const nameReg = /^[\w\s]{3,20}$/;
    const descReg = /^[\w\s.,!?'"-]{0,1500}$/;

    // Form validation
    if (!values.channelName) {
      errors.channelName = "Channel name is required";
    } else if (!nameReg.test(values.channelName)) {
      errors.channelName =
        "Letters, numbers and spaces are allowed and between 2 and 20 characters!";
    }

    if (!values.channelBanner) {
      errors.channelBanner = "Channel Banner URL is required.";
    } else if (!imageReg.test(values.channelBanner)) {
      errors.channelBanner =
        "Channel Banner URL must be a valid URL starting with http/https";
    }

    if (!values.channelLogo) {
      errors.channelLogo = "Channel Logo URL is required.";
    } else if (!imageReg.test(values.channelLogo)) {
      errors.channelLogo =
        "Channel Logo URL must be a valid URL starting with http/https";
    }

    if (!values.channelDescp) {
      errors.channelDescp = "Channel description is required";
    } else if (!descReg.test(values.channelDescp)) {
      errors.channelDescp = "Description must not be longer than 1500 words!";
    }

    setChannelError(errors);
    return Object.keys(errors).length === 0;
  }

  function handlePlaylistValidate(values) {
    const errors = {};
    const nameReg = /^[\w\s]{3,15}$/;

    if (!values.playlistName) {
      errors.playlistName = "Playlist name is required";
    } else if (!nameReg.test(values.playlistName)) {
      errors.playlistName =
        "Letters, numbers and spaces are allowed and between 2 and 15 characters!";
    }

    setPlaylistError(errors);
    return Object.keys(errors).length === 0;
  }

  function handleChannelSubmit(e) {
    e.preventDefault();
    const isValid = handleChannelValidate(channelValues);

    if (isValid) {
      const {
        channelName,
        channelLogo,
        channelBanner,
        channelDescp: description,
      } = channelValues;
      const formData = {
        channelName: channelName,
        channelLogo,
        channelBanner,
        description,
      };
      axios
        .post("https://youtubepradeep.onrender.com/channel", formData, {
          headers: {
            Authorization: `JWT ${token}`,
          },
        })
        .then((data) => {
          alert(data.data.message);
          setUser(data.data.user);
          setOpen(false);
          setChannelError({});
          setChannelValues({});
        })
        .catch((error) => console.log(error.response.data.message));
    }
  }

  function handlePlaylistSubmit(e) {
    e.preventDefault();
    const isValid = handlePlaylistValidate(playlistValues);
    if (isValid) {
      axios
        .post("https://youtubepradeep.onrender.com/playlist", playlistValues, {
          headers: {
            Authorization: `JWT ${token}`,
          },
        })
        .then((data) => {
          setUser(data.data.newUser);
          setOpen1(false);
          setPlaylistError({});
          setPLaylistValues({});
        })
        .catch((error) => alert(error.response.data.message));
    }
  }
  // Delete Playlist
  function deletePlaylist(playlist) {
    axios
      .post(
        `https://youtubepradeep.onrender.com/playlist/${playlist}`,
        {},
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      )
      .then((data) => {
        setUser(data.data.newUser);
        setPoppropen(false);
      });
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
        <div className="px-3 sm:px-5 w-full flex flex-col gap-10 md:gap-3 md:h-[calc(100vh-59.2px)] overflow-y-auto ">
          {/* Profile */}
          <div className="flex gap-4 mt-10 mb-10 md:mb-5 justify-start items-center">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="cursor-pointer w-15 h-15 text-3xl bg-orange-500 rounded-full object-cover sm:w-20 sm:h-20 sm:text-4xl md:w-32 md:h-32 md:text-5xl"
              onClick={() => SetisAccount(!Account)}
            />
            <div>
              <div className="flex-col gap-2">
                <p className="font-roboto text-2xl md:text-3xl font-semibold">
                  {user.name}
                </p>
                <p className="font-roboto text-base">@{user.username}</p>
              </div>
            </div>
          </div>

          {/* Channel Container */}
          <div className="w-full">
            {/* label */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-roboto text-xl font-medium">Channels</h1>
              <div className="flex items-center gap-3">
                <div
                  onClick={handleOpen}
                  className="cursor-pointer rounded-full w-10 h-10 flex items-center justify-center border-2 md:hover:bg-gray-100"
                >
                  <AddIcon />
                </div>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <div className=" ">
                      <div className="flex mb-8 justify-between items-center">
                        <h1 className="text-2xl font-roboto font-semibold">
                          Channel details
                        </h1>
                        <CloseIcon
                          onClick={() => {
                            setOpen(false);
                            setChannelError({});
                            setChannelValues({});
                          }}
                          className="cursor-pointer"
                          sx={{ fontWeight: 800, fontSize: 30 }}
                        />
                      </div>
                      <form
                        onSubmit={handleChannelSubmit}
                        className="flex flex-col gap-5"
                      >
                        <div className="w-full">
                          <input
                            className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2"
                            type="text"
                            placeholder="Channel name"
                            value={channelValues.channelName}
                            name="channelName"
                            onChange={handleChannelChange}
                          />
                          <p className="text-red-500 mt-0 text-sm">
                            {channelError.channelName}
                          </p>
                        </div>
                        <div className="w-full">
                          <input
                            className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2"
                            type="text"
                            placeholder="Channel Banner"
                            value={channelValues.channelBanner}
                            name="channelBanner"
                            onChange={handleChannelChange}
                          />
                          <p className="text-red-500 mt-0 text-sm">
                            {channelError.channelBanner}
                          </p>
                        </div>
                        <div className="w-full">
                          <input
                            className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2"
                            type="text"
                            placeholder="Channel Logo"
                            value={channelValues.channelLogo}
                            name="channelLogo"
                            onChange={handleChannelChange}
                          />
                          <p className="text-red-500 mt-0 text-sm">
                            {channelError.channelLogo}
                          </p>
                        </div>
                        <div className="w-full">
                          <textarea
                            className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2 resize-none"
                            placeholder="Channel Description"
                            value={channelValues.channelDescp}
                            name="channelDescp"
                            onChange={handleChannelChange}
                          ></textarea>
                          <p className="text-red-500 mt-0 text-sm">
                            {channelError.channelDescp}
                          </p>
                        </div>
                        <button
                          type="submit"
                          className="px-3 py-1 font-roboto text-base rounded-md outline-none border-2 border-blue-600"
                        >
                          Create channel
                        </button>
                      </form>
                    </div>
                  </Box>
                </Modal>
                <Link to={"/feed/channels"}>
                  <p className="py-2 px-4 border-2 hidden rounded-full cursor-pointer hover:bg-gray-100">
                    View all
                  </p>
                </Link>
              </div>
            </div>
            {/* cards */}
            <div className="flex gap-4 overflow-x-auto p-3 channel-list">
              {user && user.channelDetails && user.channelDetails.length > 0 ? (
                user.channelDetails.map((cat, index) => (
                  <Link key={index} to={`/owner/${cat.channelName}`}>
                    <div className="flex-shrink-0 w-40 flex flex-col justify-center items-center gap-1">
                      <img
                        src={cat.channelLogo}
                        alt={cat.channelName}
                        className="rounded-md object-cover hover:opacity-70"
                      />
                      <p className="text-sm font-medium mt-2">
                        {cat.channelName}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>Create your first channel.</p>
              )}
            </div>
          </div>

          {/* Playlists Container*/}
          <div className="w-full">
            {/* Label */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-roboto text-xl font-medium">Playlists</h1>
              <div className="flex items-center gap-3">
                <div
                  onClick={handleOpen1}
                  className="cursor-pointer rounded-full w-10 h-10 flex items-center justify-center border-2 hover:bg-gray-100"
                >
                  <AddIcon />
                </div>
                <Modal
                  open={open1}
                  onClose={handleClose1}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style1}>
                    <div className=" ">
                      <div className="flex mb-8 justify-between items-center">
                        <h1 className="text-2xl font-roboto font-semibold">
                          Playlist
                        </h1>
                        <CloseIcon
                          onClick={() => {
                            setOpen1(false);
                            setPlaylistError({});
                            setPLaylistValues({});
                          }}
                          className="cursor-pointer"
                          sx={{ fontWeight: 800, fontSize: 30 }}
                        />
                      </div>
                      <form
                        onSubmit={handlePlaylistSubmit}
                        className="flex flex-col gap-4 items-center justify-center"
                      >
                        <div className="w-full">
                          <input
                            className="w-full px-2 py-1 text-black placeholder:text-black font-roboto text-base rounded-md outline-none border-black border-2"
                            type="text"
                            placeholder="Playlist name"
                            value={playlistValues.playlistName}
                            name="playlistName"
                            onChange={handlePlaylistChange}
                          />
                          <p className="text-red-500 mt-0 text-sm">
                            {playlistError.playlistName}
                          </p>
                        </div>
                        <button
                          type="submit"
                          className="w-full px-2 py-1 font-roboto text-base rounded-md outline-none border-2 border-blue-600"
                        >
                          Create playlist
                        </button>
                      </form>
                    </div>
                  </Box>
                </Modal>
                <Link to={"/feed/playlists"}>
                  <p className="py-2 hidden px-4 border-2 rounded-full cursor-pointer hover:bg-gray-100">
                    View all
                  </p>
                </Link>
              </div>
            </div>
            {/* cards */}
            <div className="flex gap-4 overflow-x-auto p-3 channel-list">
              {user &&
                user.playlists &&
                user.playlists.map((cat, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-60 flex flex-col gap-2"
                  >
                    <Link to={`/playlist/${cat.name}`}>
                      <img
                        src="https://ik.imagekit.io/kf28wicizj/Youtube/playlist.jpg?updatedAt=1736162630427"
                        alt="cat.name"
                        className="rounded-md w-60 h-36 object-cover hover:opacity-70"
                      />
                    </Link>
                    <div className="flex items-center justify-between ">
                      <p className="text-sm font-medium ">{cat.name}</p>
                      <div onClick={handleClick} className="cursor-pointer w-9  h-9  flex justify-center items-center transition-all duration-150 hover:bg-gray-300 rounded-full">
                        <MoreVertIcon />
                      </div>
                    </div>
                    <Popper id={id} open={popprOpen} anchorEl={anchorEl}>
                      <Box
                        sx={{
                          border: 1,
                          p: 1,
                          bgcolor: "background.paper",
                          borderRadius: 1,
                        }}
                      >
                        <div
                          className="flex items-center gap-4 cursor-pointer"
                          onClick={() => {
                            deletePlaylist(cat.name);
                          }}
                        >
                          <DeleteOutlineIcon />
                          <h1 className="font-roboto text-black">
                            Delete Playlist
                          </h1>
                        </div>
                      </Box>
                    </Popper>
                  </div>
                ))}
            </div>
          </div>

          {/* Watch Later */}
          <div className="w-full">
            {/* Label */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-roboto text-xl font-medium">Watch Later</h1>
              <div className="flex items-center gap-3">
                <Link to={"/playlist/Watch later"}>
                  <p
                    className={`py-2 px-4 border-2 rounded-full ${
                      user &&
                      user.playlists &&
                      user.playlists[1].videos.length > 0
                        ? "hover:bg-gray-100 cursor-pointer"
                        : "cursor-not-allowed bg-gray-300"
                    }  `}
                  >
                    View all
                  </p>
                </Link>
              </div>
            </div>
            {/* Cards */}
            <div className="flex gap-4 overflow-x-auto p-3 channel-list">
              {user && user.playlists && user.playlists[1].videos.length > 0 ? (
                user.playlists[1].videos.map((cat, index) => (
                  <PlaylistCards
                    key={cat._id}
                    _id={cat._id}
                    thumbnail={cat.thumbnail}
                    title={cat.title}
                    views={cat.views}
                    channelName={cat.channelName}
                  />
                ))
              ) : (
                <div className="flex-shrink-0 w-60">
                  <img
                    src="https://ik.imagekit.io/kf28wicizj/Youtube/No%20videos%20to%20display.png?updatedAt=1736438114685"
                    alt="image"
                    className="rounded-md w-60 h-36 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Liked videos */}
          <div>
            {/* Label */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-roboto text-xl font-medium">Liked videos</h1>
              <div className="flex items-center gap-3">
                <Link to={"/playlist/Liked videos"}>
                  <p
                    className={`py-2 px-4 border-2 rounded-full ${
                      user &&
                      user.playlists &&
                      user.playlists[0].videos.length > 0
                        ? "hover:bg-gray-100 cursor-pointer"
                        : "cursor-not-allowed bg-gray-300"
                    }  `}
                  >
                    View all
                  </p>
                </Link>
              </div>
            </div>
            {/* Cards */}
            <div className="flex gap-4 overflow-x-auto p-3 channel-list justify-centers sm:justify-start">
              {user && user.playlists && user.playlists[0].videos.length > 0 ? (
                user.playlists[0].videos.map((cat, index) => (
                  <PlaylistCards
                    key={cat._id}
                    _id={cat._id}
                    thumbnail={cat.thumbnail}
                    title={cat.title}
                    views={cat.views}
                    channelName={cat.channelName}
                  />
                ))
              ) : (
                <div className="flex-shrink-0 w-60">
                  <img
                    src="https://ik.imagekit.io/kf28wicizj/Youtube/No%20videos%20to%20display.png?updatedAt=1736438114685"
                    alt="image"
                    className="rounded-md w-60 h-36 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
