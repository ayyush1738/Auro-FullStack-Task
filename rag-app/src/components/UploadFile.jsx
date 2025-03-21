import { useEffect, useState } from "react";
import FancyUploadButton from "./Lib-imorted-comp/FancyUploadButton";

const DocumentPanel = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null); // for viewing content

  // Fetch all documents on load
  useEffect(() => {
    fetch("http://localhost:8000/list/")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data.documents || []);
      });
  }, []);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleUploadClick = async () => {
    if (file) {
      setUploading(true);
      await onUpload(file);
      setFile(null);
      setUploading(false);

      // Refetch documents after upload
      const res = await fetch("http://localhost:8000/list/");
      const data = await res.json();
      setDocuments(data.documents || []);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:8000/documents/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDocuments((docs) => docs.filter((doc) => doc.id !== id));
      if (activeDoc?.id === id) setActiveDoc(null);
    }
  };

  return (
    <div className="border-t p-2 flex flex-col space-y-4 h-1/2">
      <div>
        <h2 className="text-sm font-medium mb-2 text-white">Upload Document</h2>
        <div className="flex items-center space-x-4">
          <FancyUploadButton onFileSelect={handleFileChange} />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow disabled:opacity-50"
            onClick={handleUploadClick}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <h1 className="text-lg font-medium text-white">Available Documents</h1>
      <div className="mt-2 overflow-y-auto custom-scrollbar p-4">
        {documents.length === 0 ? (
          <p className="text-sm text-gray-300 italic text-center mt-4">
            No documents available.
          </p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white shadow-sm rounded-md p-2 mb-2 cursor-pointer hover:bg-indigo-100"
            >
              <div className="flex justify-between items-center">
                <span
                  onClick={() => setActiveDoc(doc)}
                  className="text-sm font-semibold truncate w-4/5"
                >
                  <section className="text-sm font-medium mb-1 text-black">DocId:</section>
                  {doc.metadata?.name || doc.id.slice(0, 8)}
                </span>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-500 text-xs bg-gray-100 rounded px-2 py-0.5 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {activeDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar relative">
            <button
              onClick={() => setActiveDoc(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-2">Document Content</h2>
            <pre className="whitespace-pre-wrap text-sm">{activeDoc.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPanel;
