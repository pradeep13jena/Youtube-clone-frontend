import axios from "axios";
import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";

const style = {
  border: "1px solid #ddd",
  borderRadius: 3,
  P: 1,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  bgcolor: "background.paper",
  maxWidth: "200px",
  textAlign: "center",
};

export default function Comments({
  comment,
  videos,
  token,
  setComments,
  user,
}) {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the popper
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const handleEditClick = (id, user1 = comment.username) => {
    if (user.username === user1) {
      setEditingCommentId(id);
      setEditedText(comment.text);
    } else {
      alert("You can only edit your own comment");
    }
  };

  // Edit comment
  const editComment = (commentId, videoid, editedText, token) => {
    console.log(commentId, editedText, token, videoid);
    if (commentId && videoid && editedText && token) {
      axios
        .put(
          `http://localhost:5000/comment`,
          {
            videoid: videoid,
            commentId: commentId,
            newComment: editedText,
          },
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        )
        .then((response) => {
          // Update comments state with the edited comment list
          setComments(response.data.video.comments);
          setEditingCommentId(null);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert(
        "Please provide all required inputs (commentId, videoid, editedText, and token)."
      );
    }
  };

  // Delete comment
  const deleteComment = (commentId) => {
    if (commentId) {
      axios
        .delete(`http://localhost:5000/comment`, {
          data: {
            id: videos._id,
            commentId: commentId,
          },
          headers: {
            Authorization: `JWT ${token}`,
          },
        })
        .then((response) => {
          setComments(response.data.comments);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };
  return (
    <div key={comment._id} className="flex items-center justify-start gap-3 mt-4   ">
      <div className="flex gap-2 items-start flex-1">
        <div className="flex flex-col gap-1 flex-1">
          <p className="font-medium text-base text-gray-900">
            {comment.username}
          </p>
          {editingCommentId === comment._id ? (
            <div className="flex flex-col flex-1 gap-2">
              <textarea
                value={editedText}
                onChange={(e) => {
                  setEditedText(e.target.value);
                }}
                className="w-full py-1 px-2 border font-roboto border-b-black outline-none rounded-md resize-none"
                rows={2}
              ></textarea>
              <div className={`flex gap-3`}>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="py-1 px-2 rounded-lg hover:bg-gray-100 border-2 font-semibold cursor-pointer text-red-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    editComment(comment._id, videos._id, editedText, token)
                  }
                  className="py-1 px-2 rounded-lg hover:bg-gray-100 border-2 font-semibold cursor-pointer text-blue-500"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-black text-sm">{comment.text}</p>
          )}
        </div>
      </div>
      <div>
        <div
          onClick={handleClick}
          className={`${
            comment.username !== user.username ? "hidden" : ""
          } cursor-pointer transition duration-150 hover:bg-gray-400 w-10 h-10 flex justify-center items-center rounded-full`}
        >
          <MoreVertIcon />
        </div>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Box sx={style}>
            <div
              onClick={() => {
                deleteComment(comment._id);
                handleClose;
              }}
              className="flex items-center gap-3 cursor-pointer hover:rounded-md hover:bg-gray-300 px-3 py-3"
            >
              <DeleteOutlineIcon />
              <p className="font-roboto text-base text-black hover:rounded-md">
                Delete Comment
              </p>
            </div>
            <div
              onClick={() => {
                handleEditClick(comment._id);
                handleClose;
              }}
              className="flex items-center gap-3 cursor-pointer hover:rounded-md hover:bg-gray-300 px-3 py-3"
            >
              <EditIcon />
              <p className="font-roboto text-base text-black hover:rounded-md">
                Edit Comment
              </p>
            </div>
          </Box>
        </Popper>
      </div>
    </div>
  );
}
