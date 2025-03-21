import { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file && !text) return alert("Please upload a file or enter text");
    setLoading(true);
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text) formData.append("content", text);
    
    try {
      const response = await axios.post("http://localhost:8000/documents/", formData);
      alert("Document Uploaded: " + response.data.id);
    } catch (error) {
      alert("Upload failed: " + error.response?.data?.detail);
    }
    setLoading(false);
  };

  const handleQuery = async () => {
    if (!question) return alert("Please enter a question");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/query/",
        { question },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ✅ Ensure CORS credentials are included
        }
      );
      
      
      setAnswer(response.data.answer);
    } catch (error) {
      alert("Query failed: " + error.response?.data?.detail);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">RAG-Based Q&A</h1>
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        <input type="file" onChange={handleFileChange} className="mb-2 block w-full border p-2" />
        <textarea
          placeholder="Or enter text manually"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border p-2 mb-2"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 text-white p-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Document"}
        </button>
      </div>

      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md mt-6">
        <input
          type="text"
          placeholder="Ask a question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2 mb-2"
        />
        <button
          onClick={handleQuery}
          className="w-full bg-green-500 text-white p-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Get Answer"}
        </button>
        {answer && <p className="mt-4 p-2 bg-gray-100 rounded">{answer}</p>}
      </div>
    </div>
  );
}
