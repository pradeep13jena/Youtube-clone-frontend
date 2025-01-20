// Responsible to show the loader page which is a buffering gif, it works for the lazy Loading and Suspense.
// This page is a fallback in case it takes longer to display the desired page.

import React from "react";
import "../styles/errorpage.css";

export default function LoadingPage() {
  return (
    <div className="LoaderDIV">
      <img
        src="https://ik.imagekit.io/kf28wicizj/category_images/suffering.gif?updatedAt=1733658689656"
        alt="Buffering"
      />
    </div>
  );
}
