import React, { useRef } from "react";
import "./FancyUploadButton.css";

const FancyUploadButton = ({ onFileSelect }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="fancy-upload-wrapper" onClick={() => fileInputRef.current.click()}>
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="continue-application" role="button" tabIndex={0}>
        <div className="icon-wrapper">
          <div className="pencil"></div>
          <div className="folder">
            <div className="top">
              <svg viewBox="0 0 24 27">
                <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z"></path>
              </svg>
            </div>
            <div className="paper"></div>
          </div>
        </div>
        <span>Choose File</span>
      </div>
    </div>
  );
};

export default FancyUploadButton;
