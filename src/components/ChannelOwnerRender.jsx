// To render
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { MoreVertOutlined } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/tokenSlice";

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

// Function to convert the numbers to alphabets
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

export default function ChannelOwnerRender({ cat, setChannelDetails }) {
  const { token } = useSelector(selectAuth);
  const [openModal, setOpenModal] = useState(false);

  const [Addvideo, setAddvideo] = useState(false);
  const handleAddvideo = () => setAddvideo(true);
  const handleCloseAddvideo = () => setAddvideo(false);

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

    // Video Title Validation
    if (values.videoTitle && !titleReg.test(values.videoTitle)) {
      errors.videoTitle =
        "Video Title must only contain alphanumeric characters and spaces!";
    }

    // Video Description Validation (Optional)
    if (values.videoDescription && values.videoDescription.trim() === "") {
      errors.videoDescription =
        "Video Description cannot be empty if provided!";
    }

    // Video URL Validation (Optional)
    if (values.videoURL && !urlReg.test(values.videoURL)) {
      errors.videoURL =
        "Video URL must be a valid URL starting with http/https!";
    }

    // Video Thumbnail Validation (Optional)
    if (values.videoThumbnail && !urlReg.test(values.videoThumbnail)) {
      errors.videoThumbnail =
        "Thumbnail URL must be a valid URL starting with http/https!";
    }

    // Video Genre Validation (Optional)
    if (values.videoGenre && !genreReg.test(values.videoGenre)) {
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
        .put(`http://localhost:5000/videos/${cat._id}`, formData, {
          headers: {
            Authorization: `JWT ${token}`,
          },
        })
        .then((data) => alert(data.data.message))
        .catch((error) => alert(error.response.data.message));
    }
  }

  function deleteVideo(videoId) {
    axios
      .put(
        `http://localhost:5000/videos/${cat.channelName}/${cat._id}`,
        {},
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      )
      .then((data) => setChannelDetails(data.data.updatedChannel))
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex flex-col">
      <div className="flex md:flex-col sm:gap-[1px] transform transition-transform duration-300">
        <Link to={`/watch?v=${cat._id}`}>
          <img
            src={cat.thumbnail}
            alt={cat.title}
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
              className="cursor-pointer hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-end sm:justify-center hover:border-gray-300 z-40"
            >
              <MoreVertOutlined className="text-gray-700" />
            </div>
            <div
              className={` bottom-16 right-8 rounded-md shadow-md bg-white ${
                openModal ? "fixed" : "hidden"
              } `}
            >
              <div className="py-1 z-50">
                <div className="flex items-center cursor-pointer hover:bg-gray-200 hover:text-black gap-2 px-2 py-2">
                  <ModeEditOutlineIcon />
                  <h1
                    onClick={handleAddvideo}
                    className="text-base font-roboto "
                  >
                    Edit video
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
                            Edit Video
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
                              placeholder="Video genre"
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
                            update Video
                          </button>
                        </form>
                      </div>
                    </Box>
                  </Modal>
                </div>
                <div className="flex items-center cursor-pointer hover:bg-gray-200 hover:text-black gap-2 px-2 py-2">
                  <DeleteOutlineIcon />
                  <h1
                    className="text-base font-roboto "
                    onClick={() => deleteVideo(cat._id)}
                  >
                    Delete video
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
