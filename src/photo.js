import React from "react";
import { saveAs } from "file-saver";
// import { useEffect } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";

// import { useState } from "react";
const Photo = ({
  id,
  tags,
  alt_description,
  urls: { regular, raw },
  likes,
  user: {
    name,
    portfolio_url,
    profile_image: { medium },
  },
}) => {
  // console.log(raw);
  ///////

  const handleDownload = () => {
    saveAs(raw, "photoHUB.jpeg");
  };
  ///
  return (
    <article className="photo">
      <p>{name}</p>
      {/* <p>{thunb}</p> */}

      <img src={regular} alt={alt_description} />
      <div className="photo-info">
        <div>
          <h4>{name}</h4>
          <p> {likes}❤️</p>
        </div>
        <div>
          <button className="download-btn" onClick={handleDownload}>
            <IoCloudDownloadOutline className="download center" />
          </button>
          <a href={portfolio_url}>
            <img src={medium} alt={name} className="user-img"></img>
          </a>
        </div>
      </div>
    </article>
  );
};
export default Photo;
