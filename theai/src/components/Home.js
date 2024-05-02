import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./Home.css";
import fileIcon from "./img/document.png";
import downloadIcon from "./img/download.jpg";

const Home = () => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generatedContent, setGeneratedContent] = useState("");
  //   const [showPreview, setShowPreview] = useState(false);
  const [paperGenerated, setPaperGenerated] = useState(false);
  const onDropHandler = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile.type === "text/plain") {
      setFile(selectedFile);
      setMsg(null);
    } else {
      setFile(null);
      setMsg("Only text files (.txt) are allowed.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropHandler,
    accept: ".txt",
  });

  function handleUpload() {
    if (!file) {
      setMsg("No file selected");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    setMsg("Processing....");

    axios
      .post("http://localhost:5002/process_file", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        setMsg("Processing completed");
        setUploadedFiles([
          ...uploadedFiles,
          { name: file.name, content: res.data.ContentList },
        ]);
        setGeneratedContent(res.data.ContentList);
        console.log("Generated Content", generatedContent);
        setPaperGenerated(true);
      })

      .catch((err) => {
        setMsg("Processing failed");
        console.log(err);
      });
  }

  return (
    <>
      <div className="home-heading">
        <h1>Welcome to AI Writer</h1>
      </div>
      <div className="home">
        <div className="left">
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
              accept=".txt"
              style={{ display: "none" }}
            />
          </div>

          {msg && <span>{msg}</span>}

          <button onClick={handleUpload}>Generate Paper</button>
        </div>
        <div className="right">
          <h2 className="research">Your Research Papers</h2>

          <ul>
            {uploadedFiles
              .slice()
              .reverse()
              .map((file, index) => (
                <div className="wrapper" key={index}>
                  <li>
                    <img src={fileIcon} alt="File Icon" className="file-icon" />
                    <span>{file.name}</span>
                    <a
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                        file.content
                      )}`}
                      download={file.name}
                    >
                      <img
                        src={downloadIcon}
                        alt="Download Icon"
                        className="download-icon"
                      />
                    </a>
                  </li>
                  {/* <pre>{file.content}</pre> */}
                </div>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
