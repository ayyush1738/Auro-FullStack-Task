import { useEffect, useState } from "react";

const DocumentPanel = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUploadClick = async () => {
    if (file) {
      await onUpload(file);
      setFile(null); // reset file
    }
  };

  return (
    <div className="border-t p-2 flex flex-col space-y-2 overflow-y-auto">
      <div>
        <h2 className="text-sm font-medium mb-1">Upload Document</h2>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button
          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md disabled:opacity-50"
          onClick={handleUploadClick}
          disabled={!file}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default DocumentPanel;