// Component which manages the owner pov of the channel where
// the owner can add, edit and delete a video and apart from
// it delete the channel as well.

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import ChannelOwnerRender from "./ChannelOwnerRender";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

import { useSelector } from "react-redux";
import { selectAuth } from "../features/tokenSlice";
import { useNavigate } from "react-router-dom";

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

export default function ChannelOwner() {
  const { channel } = useParams();
  const { token } = useSelector(selectAuth);
  const navigate = useNavigate();

  const [Addvideo, setAddvideo] = useState(false);
  const handleAddvideo = () => setAddvideo(true);
  const handleCloseAddvideo = () => setAddvideo(false);

  const [editDescp, setEditDescp] = useState(false);
  const handleEditDescp = () => setEditDescp(true);
  const handleClodeEditDescp = () => setEditDescp(false);

  const [updateBanner, setUpdateBanner] = useState(false);
  const handleupdateBanner = () => setUpdateBanner(true);
  const handleCloseupdateBanner = () => setUpdateBanner(false);

  const [updateLogo, setUpdateLogo] = useState(false);
  const handleupdateLogo = () => setUpdateLogo(true);
  const handleCloseupdateLogo = () => setUpdateLogo(false);

  const [channelDetails, setChannelDetails] = useState({});
  const [Expand, setExpand] = useState(false);

  // Function which manages to change the number to numbers
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

  useEffect(() => {
    if (token && channel) {
      axios
        .get(`http://localhost:5000/channel/${channel}`, {
          headers: {
            Authorization: `JWT ${token}`,
          },
        })
        .then((response) => {
          setChannelDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching channel details:", error);
        });
    }
  }, [token, channel]); // Added token and channel to dependency array

  // Delete channel
  function deleteChannel(channel) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${channel}?`
    );
    if (confirmDelete) {
      axios
        .delete(
          `http://localhost:5000/channel/${channel}`,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        )
        .then((data) => navigate("/feed/you"))
        .catch((err) => console.log(err));
    }
  }

  // Add video
  const [videoErrors, setVideoError] = useState({});
  const [videoValues, setVideoValues] = useState({
    videoTitle: "",
    videoDescription: "",
    videoURL: "",
    videoThumbnail: "",
    videoGenre: "",
  });

  function handleVideoChange(e) {
    const { name, value } = e.target;
    setVideoValues({ ...videoValues, [name]: value });
  }

  function handleVideoValidation(values) {
    const errors = {};
    const urlReg = /^(http|https):\/\/[^\s]+$/;
    const titleReg = /.+/; // For video title (alphanumeric + spaces)
    const genreReg = /^[A-Za-z\s,]+$/; // For video genre (alphabets + spaces + commas)

    if (!values.videoTitle) {
      errors.videoTitle = "Video Title is required";
    } else if (!titleReg.test(values.videoTitle)) {
      errors.videoTitle =
        "Video Title must only contain alphanumeric characters and spaces!";
    }

    if (!values.videoDescription) {
      errors.videoDescription = "Video Description is required";
    }

    if (!values.videoURL) {
      errors.videoURL = "Video URL is required";
    } else if (!urlReg.test(values.videoURL)) {
      errors.videoURL =
        "Video URL must be a valid URL starting with http/https!";
    }

    if (!values.videoThumbnail) {
      errors.videoThumbnail = "Video Thumbnail is required";
    } else if (!urlReg.test(values.videoThumbnail)) {
      errors.videoThumbnail =
        "Thumbnail URL must be a valid URL starting with http/https!";
    }

    if (!values.videoGenre) {
      errors.videoGenre = "Video Genre is required";
    } else if (!genreReg.test(values.videoGenre)) {
      errors.videoGenre =
        "Video Genre must only contain alphabets, spaces, and commas!";
    }

    setVideoError(errors);
    return Object.keys(errors).length === 0;
  }

  function handleVideoSubmit(e) {
    e.preventDefault();
    const isValid = handleVideoValidation(videoValues);
    if (isValid) {
      const {
        videoTitle: title,
        videoDescription: description,
        videoURL: videoLink,
        videoThumbnail: thumbnail,
        videoGenre: categories,
      } = videoValues;
      const formData = { title, description, videoLink, thumbnail, categories };
      axios
        .post(
          `http://localhost:5000/channel/${channelDetails.channelName}/videos`,
          formData,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        )
        .then((data) => {
          alert(data.data.message);
          console.log(data)
          setChannelDetails(data.data.channelWithVideo);
        })
        .catch((error) => console.log(error));
    }
  }

  // Banner Update
  const [BannerValues, setBannerValues] = useState({
    bannerURL: "",
  });
  const [BannerError, setBannerError] = useState({});

  function handleBannerChange(e) {
    const { name, value } = e.target;
    setBannerValues({ ...BannerValues, [name]: value });
  }

  function handleBannerValidata(values) {
    const errors = {};
    const imageReg = /^(http|https):\/\/[^\s]+$/;

    if (!values.bannerURL) {
      errors.bannerURL = "Banner URL is required";
    } else if (!imageReg.test(values.bannerURL)) {
      errors.bannerURL =
        "Channel Banner URL must be a valid URL starting with http/https!";
    }

    setBannerError(errors);
    return Object.keys(errors).length === 0;
  }

  function handleBannerSubmit(e) {
    e.preventDefault();
    const isValid = handleBannerValidata(BannerValues);
    if (isValid) {
      const formData = { channelBanner: BannerValues.bannerURL };
      axios
        .put(
          `http://localhost:5000/channel/${channelDetails.channelName}`,
          formData,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        )
        .then((data) => setChannelDetails(data.data.channel))
        .catch((err) => console.log(err));
    }
  }

  // Logo Update
  const [LogoValues, setLogoValues] = useState({
    logoURL: "",
  });
  const [LogoError, setLogoError] = useState({});

  function handleLogoChange(e) {
    const { name, value } = e.target;
    setLogoValues({ ...LogoValues, [name]: value });
  }

  function handleLogoValidate(values) {
    const errors = {};
    const imageReg = /^(http|https):\/\/[^\s]+$/;

    if (!values.logoURL) {
      errors.logoURL = "Logo URL is required";
    } else if (!imageReg.test(values.logoURL)) {
      errors.logoURL =
        "Logo Banner URL must be a valid URL starting with http/https!";
    }

    setLogoError(errors);
    return Object.keys(errors).length === 0;
  }

  function handleLogoSubmit(e) {
    e.preventDefault();
    const isValid = handleLogoValidate(LogoValues);
    if (isValid) {
      const formData = { channelLogo: LogoValues.logoURL };
      axios
        .put(
          `http://localhost:5000/channel/${channelDetails.channelName}`,
          formData,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        )
        .then((data) => setChannelDetails(data.data.channel))
        .catch((err) => console.log(err));
    }
  }

  // Name and description
  const [DescValues, setDescValues] = useState({
    newChannelName: "",
    description: "",
  });
  const [DescError, setDescError] = useState({});

  function handleNameChange(e) {
    const { name, value } = e.target;
    setDescValues({ ...DescValues, [name]: value });
  }

  function handleNameValidate(values) {
    const errors = {};
    const nameReg = /^[\w\s]{3,15}$/;
    const descReg = /^[\w\s.,!?'"-]{0,200}$/;

    if (values.channelName) {
      if (!nameReg.test(values.channelName)) {
        errors.channelName =
          "Letters, numbers, and spaces are allowed and must be between 2 and 15 characters!";
      }
    }

    if (values.channelDescp) {
      if (!descReg.test(values.channelDescp)) {
        errors.channelDescp = "Description must not be longer than 200 words!";
      }
    }

    setDescError(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNameSubmit(e) {
    e.preventDefault();
    const isValid = handleNameValidate(DescValues);
    if (isValid) {
      const formData = Object.fromEntries(
        Object.entries(DescValues)
          .filter(([_, value]) => value) // Remove keys with falsy values
          .map(([key, value]) => [
            key,
            typeof value === "string" ? value.trim() : value,
          ]) // Trim strings
      );

      axios
        .put(
          `http://localhost:5000/channel/${channelDetails.channelName}`,
          formData,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        )
        .then((data) => {
          if (data.data.channel.channelName) {
            navigate(`/owner/${data.data.channel.channelName}`);
          }
          setChannelDetails(data.data.channel)
        })
        .catch((err) => alert(err.response.data.message));
    }
  }

  return (
    <div className="md:h-[calc(100vh-59.2px)] overflow-y-auto px-3 md:px-24 flex flex-col gap-4 md:gap-7 py-0 w-full">
      {!token ? (
        <div className="m-auto">
          <Link to={"/signin"}>
            <h1 className="text-base font-roboto font-medium px-3 py-1 bg-gray-100 rounded-full border-[1px] border-black hover:bg-gray-200">
              Login / sign up
            </h1>
          </Link>
        </div>
      ) : (
        <>
          <div
            className="channelBanner w-full relative"
            style={{ paddingTop: "16.13%" }}
          >
            <img
              src={channelDetails.channelBanner}
              alt={channelDetails.channelName}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg md:rounded-xl"
            />
            <p
              onClick={handleupdateBanner}
              className="absolute right-2 bottom-2 sm:right-1 sm:bottom-1 cursor-pointer bg-black rounded-full w-[2px] sm:w-9 h-[2px] sm:h-9 p-1 flex justify-center items-center"
            >
              <ModeEditOutlineIcon
                sx={{ color: "white", fontSize: { xs: 15, sm: 15, lg: 20 } }}
              />
            </p>
            <Modal
              open={updateBanner}
              onClose={handleCloseupdateBanner}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style1}>
                <div className=" ">
                  <div className="flex mb-8 justify-between items-center">
                    <h1 className="text-2xl font-roboto font-semibold">
                      Banner
                    </h1>
                    <CloseIcon
                      onClick={() => {
                        setUpdateBanner(false);
                        setBannerError({});
                        setBannerValues({});
                      }}
                      className="cursor-pointer"
                      sx={{ fontWeight: 800, fontSize: 30 }}
                    />
                  </div>
                  <form
                    onSubmit={handleBannerSubmit}
                    className="flex flex-col gap-4 items-center justify-center"
                  >
                    <div className="w-full">
                      <input
                        className="w-full px-2 py-1 text-black placeholder:text-gray-500 font-roboto text-base rounded-md outline-none border-black border-2"
                        type="text"
                        placeholder="Banner URL"
                        name="bannerURL"
                        value={BannerValues.bannerURL}
                        onChange={handleBannerChange}
                      />
                      <p className="text-red-500 mt-0 text-sm">
                        {BannerError.bannerURL}
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-2 py-1 font-roboto text-base rounded-md outline-none border-2 border-blue-600"
                    >
                      Update Banner
                    </button>
                  </form>
                </div>
              </Box>
            </Modal>
          </div>
          <div className="channelDetails w-full flex justify-start items-center gap-4 mb-5 md:mb-0">
            <div className="relative flex-shrink-0">
              <img
                src={channelDetails.channelLogo}
                alt={channelDetails.channelName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full md:w-32 md:h-32"
              />
              <p
                onClick={handleupdateLogo}
                className="absolute right-0 bottom-0 cursor-pointer bg-black rounded-full w-5 h-5 sm:w-9 sm:h-9 p-1 flex justify-center items-center"
              >
                <ModeEditOutlineIcon
                  sx={{ color: "white", fontSize: { xs: 12, sm: 15, lg: 20 } }}
                />
              </p>
              <Modal
                open={updateLogo}
                onClose={handleCloseupdateLogo}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style1}>
                  <div className=" ">
                    <div className="flex mb-8 justify-between items-center">
                      <h1 className="text-2xl font-roboto font-semibold">
                        Profile
                      </h1>
                      <CloseIcon
                        onClick={() => {
                          setUpdateLogo(false);
                          setLogoError({});
                          setLogoValues({});
                        }}
                        className="cursor-pointer"
                        sx={{ fontWeight: 800, fontSize: 30 }}
                      />
                    </div>
                    <form
                      onSubmit={handleLogoSubmit}
                      className="flex flex-col gap-4 items-center justify-center"
                    >
                      <div className="w-full">
                        <input
                          className="w-full px-2 py-1 text-black placeholder:text-gray-500 font-roboto text-base rounded-md outline-none border-black border-2"
                          type="text"
                          placeholder="Logo URL"
                          name="logoURL"
                          value={LogoValues.logoURL}
                          onChange={handleLogoChange}
                        />
                        <p className="text-red-500 mt-0 text-sm">
                          {LogoError.logoURL}
                        </p>
                      </div>
                      <button
                        type="submit"
                        className="w-full px-2 py-1 font-roboto text-base rounded-md outline-none border-2 border-blue-600"
                      >
                        Update Logo
                      </button>
                    </form>
                  </div>
                </Box>
              </Modal>
            </div>
            <div className="flex flex-col md:gap-3">
              <h1 className="text-xl md:text-3xl font-semibold font-roboto">
                {channelDetails.channelName}
                <span
                  className="text-xs font-normal cursor-pointer text-blue-600 underline ml-2"
                  onClick={handleEditDescp}
                >
                  edit
                </span>
              </h1>
              <Modal
                open={editDescp}
                onClose={handleClodeEditDescp}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style1}>
                  <div className=" ">
                    <div className="flex mb-8 justify-between items-center">
                      <h1 className="text-base md:text-2xl font-roboto font-semibold">
                        Edit text
                      </h1>
                      <CloseIcon
                        onClick={() => setEditDescp(false)}
                        className="cursor-pointer"
                        sx={{ fontWeight: 800, fontSize: 30 }}
                      />
                    </div>
                    <form
                      action=""
                      className="flex flex-col gap-5"
                      onSubmit={handleNameSubmit}
                    >
                      <div className="w-full">
                        <input
                          className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2"
                          type="text"
                          placeholder="Channel Name"
                          name="newChannelName"
                          value={DescValues.newChannelName}
                          onChange={handleNameChange}
                        />
                        <p className="text-red-500 mt-0 text-sm">
                          {DescError.newChannelName}
                        </p>
                      </div>
                      <div className="w-full">
                        <textarea
                          className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2 resize-none"
                          placeholder="Channel Description"
                          name="description"
                          value={DescValues.description}
                          onChange={handleNameChange}
                        ></textarea>
                        <p className="text-red-500 mt-0 text-sm">
                          {DescError.description}
                        </p>
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1 font-roboto text-base rounded-md outline-none border-2 border-blue-600"
                      >
                        Update details
                      </button>
                    </form>
                  </div>
                </Box>
              </Modal>
              <div className="flex flex-col gap-1 items-start justify-start mb-3 md:mb-0">
                <div className="flex items-center gap-0 justify-start">
                  <p className="text-sm text-gray-800">
                    {formatNumber(channelDetails && channelDetails.subscribers)}{" "}
                    subscribers
                  </p>
                  <p className="text-sm px-1 text-gray-800">&#x2022;</p>
                  <p className="text-sm text-gray-800">
                    {channelDetails &&
                      channelDetails.videos &&
                      channelDetails.videos.length}{" "}
                    videos
                  </p>
                </div>
                <p
                  className={`font-roboto text-sm md:text-base font-light text-black duration-300 ${
                    Expand ? "" : "line-clamp-1"
                  }`}
                >
                  {channelDetails.description}
                </p>
                <span
                  onClick={() => setExpand(!Expand)}
                  className="font-roboto text-sm  text-gray-800 cursor-pointer"
                >
                  {Expand ? "less" : "more..."}
                </span>
              </div>
              <div className="flex justify-start items-center gap-2">
                <h1
                  className={`md:px-4 flex gap-1 items-center py-2 px-3 cursor-pointer rounded-3xl text-xs md:text-base font-roboto hover:opacity-80 duration-100
                        bg-gray-300 text-black hover:bg-gray-500 hover:text-white
                    `}
                  onClick={handleAddvideo}
                >
                  Add video
                </h1>
                <h1
                  className={`md:px-4 flex gap-1 items-center py-2 px-3 cursor-pointer rounded-3xl text-xs md:text-base font-roboto hover:opacity-80 duration-100
                        bg-gray-300 text-black hover:bg-gray-500 hover:text-white
                    `}
                  onClick={() => deleteChannel(channelDetails.channelName)}
                >
                  Delete channel
                </h1>
                <Modal
                  open={Addvideo}
                  onClose={handleCloseAddvideo}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style1}>
                    <div className=" ">
                      <div className="flex mb-8 justify-between items-center">
                        <h1 className="text-base md:text-2xl font-roboto font-semibold">
                          Add Video
                        </h1>
                        <CloseIcon
                          onClick={() => setAddvideo(false)}
                          className="cursor-pointer"
                          sx={{ fontWeight: 800, fontSize: 30 }}
                        />
                      </div>
                      <form
                        onSubmit={handleVideoSubmit}
                        className="flex flex-col gap-5"
                      >
                        <div className="w-full">
                          <input
                            className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2"
                            type="text"
                            placeholder="Video title"
                            value={videoValues.videoTitle}
                            name="videoTitle"
                            onChange={handleVideoChange}
                          />
                          <p className="text-red-500 mt-0 text-sm">
                            {videoErrors.videoTitle}
                          </p>
                        </div>
                        <div className="w-full">
                          <input
                            className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2"
                            type="text"
                            placeholder="Video thumbnail"
                            value={videoValues.videoThumbnail}
                            name="videoThumbnail"
                            onChange={handleVideoChange}
                          />
                          <p className="text-red-500 mt-0 text-sm">
                            {videoErrors.videoThumbnail}
                          </p>
                        </div>
                        <div className="w-full">
                          <input
                            className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2"
                            type="text"
                            placeholder="Video URL"
                            value={videoValues.videoURL}
                            name="videoURL"
                            onChange={handleVideoChange}
                          />
                          <p className="text-red-500 mt-0 text-sm">
                            {videoErrors.videoURL}
                          </p>
                        </div>
                        <div className="w-full">
                          <input
                            className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2"
                            type="text"
                            placeholder='Video genre ("Jobs, Cinema, Cartoon")'
                            value={videoValues.videoGenre}
                            name="videoGenre"
                            onChange={handleVideoChange}
                          />
                          <p className="text-red-500 mt-0 text-sm">
                            {videoErrors.videoGenre}
                          </p>
                        </div>
                        <div className="w-full">
                          <textarea
                            className="w-full px-3 py-1 font-roboto text-lg border-gray-600 rounded-md outline-none border-2 resize-none"
                            placeholder="Video Description"
                            value={videoValues.videoDescription}
                            name="videoDescription"
                            onChange={handleVideoChange}
                          ></textarea>
                          <p className="text-red-500 mt-0 text-sm">
                            {videoErrors.videoDescription}
                          </p>
                        </div>
                        <button
                          type="submit"
                          className="px-3 py-1 font-roboto text-base rounded-md outline-none border-2 border-blue-600"
                        >
                          Add video
                        </button>
                      </form>
                    </div>
                  </Box>
                </Modal>
              </div>
            </div>
          </div>
          <div className="videoList w-full border-b-2 sm:sticky top-0 bg-white z-0">
            <div className="sliderContent pb-0 sm:pb-3 flex justify-between md:justify-start overflow-x-auto gap-6">
              <h1 className="font-roboto text-base font-medium text-black cursor-pointer transition-all">
                Home
              </h1>
              <h1 className="font-roboto text-base font-medium text-gray-700 cursor-pointer transition-all">
                Videos
              </h1>
              <h1 className="font-roboto text-base font-medium text-gray-700 cursor-pointer transition-all">
                Shorts
              </h1>
              <h1 className="font-roboto text-base font-medium text-gray-700 cursor-pointer transition-all">
                Playlists
              </h1>
              <h1 className="font-roboto text-base font-medium text-gray-700 cursor-pointer transition-all">
                Community
              </h1>
            </div>
          </div>
          <div className="w-full mt-0 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-3 sm:gap-4">
            {channelDetails &&
              channelDetails.videoDetails &&
              channelDetails.videoDetails.map((cat, index) => {
                return <ChannelOwnerRender key={index} setChannelDetails={setChannelDetails} cat={cat} />;
              })}
          </div>
        </>
      )}
    </div>
  );
}
