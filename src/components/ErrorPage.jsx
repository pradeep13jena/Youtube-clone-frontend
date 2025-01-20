// In case user get to a wrong url

import React from "react";
import "../styles/ErrorPage.css";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="ErrorSection">
      <img
        src="https://ik.imagekit.io/kf28wicizj/images/bckup4042.jpg?updatedAt=1732715823485"
        alt="404 Page"
      />
      <p className="greatKid">Great shot, kid. That was one in a million.</p>
      <p className="letsget">
        Now, let’s head{" "}
        <span>
          <Link className="animateTheBack" to={"/"}>
            home
          </Link>
          .
        </span>
      </p>
    </div>
  );
}
