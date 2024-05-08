import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./Upload.css";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onDropHandler = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile.type === "text/plain") {
      setFile(selectedFile);
      setMsg(null);
    } else {
      setFile(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropHandler,
    accept: ".pdf",
  });

  const submitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const result = await axios.post(
        "http://localhost:8000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (result.status === 200) {
        setMsg("Paper uploaded succesfully");
      }
    } catch (error) {
      console.error("Error submitting file:", error);
    }
  };

  return (
    <>
      <div className="home-heading">
        <h1>Welcome to AI Writer</h1>
      </div>
      <div className="home">
        <div className="left">
          <div className="title-description">
            <input
              className="title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="drop-area" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <h3>Drag and Drop text files here</h3>
            )}
            <p>OR</p>

            <label htmlFor="file-upload" className="custom-file-upload">
              Select a text file
            </label>
            {file && (
              <div className="file-info">Uploaded File: {file.name}</div>
            )}
            <input
              id="file-upload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf"
              style={{ display: "none" }}
            />
          </div>

          {msg && <span>{msg}</span>}

          <button onClick={submitFile}>Upload Paper</button>
        </div>
      </div>
    </>
  );
};

export default Upload;
