import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Upload.css";

const Upload = () => {
  const { state } = useLocation();
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState({
    artificialIntelligence: false,
    blockchain: false,
    deepLearning: false,
    frontendDevelopment: false,
    backendDevelopment: false,
    databases: false,
  });
  console.log(state.username);
  const onDropHandler = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    const fileName = selectedFile.name;
    const fileExtension = fileName.slice(
      ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
    );

    if (fileExtension.toLowerCase() === "pdf") {
      setFile(selectedFile);
      setMsg(null);
      console.log(selectedFile);
    } else {
      setFile(null);
      setMsg("Please upload a PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropHandler,
    accept: ".pdf",
  });

  const submitFile = async (e, draft) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("username", state.username);
    formData.append("draft", draft);

    const formattedCategories = Object.keys(categories)
      .filter((category) => categories[category])
      .map((category) => category.toLowerCase().replace(/\s+/g, ""));

    formattedCategories.forEach((category) => {
      formData.append("categories", category);
    });

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
        setMsg("Paper uploaded successfully");
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
          <div className="categories">
            <label>
              <input
                type="checkbox"
                checked={categories.artificialIntelligence}
                onChange={(e) =>
                  setCategories({
                    ...categories,
                    artificialIntelligence: e.target.checked,
                  })
                }
              />
              Artificial Intelligence
            </label>
            <label>
              <input
                type="checkbox"
                checked={categories.deepLearning}
                onChange={(e) =>
                  setCategories({
                    ...categories,
                    deepLearning: e.target.checked,
                  })
                }
              />
              Deep Learning
            </label>
            <label>
              <input
                type="checkbox"
                checked={categories.blockchain}
                onChange={(e) =>
                  setCategories({
                    ...categories,
                    blockchain: e.target.checked,
                  })
                }
              />
              Blockchain
            </label>
            <label>
              <input
                type="checkbox"
                checked={categories.frontendDevelopment}
                onChange={(e) =>
                  setCategories({
                    ...categories,
                    frontendDevelopment: e.target.checked,
                  })
                }
              />
              Frontend Development
            </label>
            <label>
              <input
                type="checkbox"
                checked={categories.backendDevelopment}
                onChange={(e) =>
                  setCategories({
                    ...categories,
                    backendDevelopment: e.target.checked,
                  })
                }
              />
              Backend Development
            </label>
            <label>
              <input
                type="checkbox"
                checked={categories.databases}
                onChange={(e) =>
                  setCategories({
                    ...categories,
                    databases: e.target.checked,
                  })
                }
              />
              Databases
            </label>
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
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf"
              style={{ display: "none" }}
            />
          </div>
          <div className="buttonss">
            {msg && <span className="spanelement">{msg}</span>}
            <button className="button" onClick={(e) => submitFile(e, 0)}>
              Upload Paper
            </button>
            <button className="button" onClick={(e) => submitFile(e, 1)}>
              Save as draft
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;
