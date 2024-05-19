import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const { state } = useLocation();
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    degree: "",
    department: "",
    interests: "",
    institution: "",
    skills: "",
    currentActivity: "",
    profileImage: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  useEffect(() => {
    if (state && state.username) {
      setUsername(state.username);
      fetchProfileData(state.username);
    }
  }, [state]);

  const fetchProfileData = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/profile/${username}`
      );
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append("username", username);
    dataToSend.append("degree", formData.degree);
    dataToSend.append("department", formData.department);
    dataToSend.append("interests", formData.interests);
    dataToSend.append("institution", formData.institution);
    dataToSend.append("skills", formData.skills);
    dataToSend.append("currentActivity", formData.currentActivity);
    if (image) {
      dataToSend.append("profileImage", image);
    }

    try {
      const response = await fetch("http://localhost:8000/api/profile", {
        method: "POST",
        body: dataToSend,
      });

      if (response.ok) {
        console.log("Profile submitted successfully");
        setIsEditing(false);
        setIsEditingImage(false);
        fetchProfileData(username);
      } else {
        console.log("Failed to submit profile");
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
    }
  };

  const renderFormField = (label, name, value) => (
    <div className={styles.formGroup}>
      <label htmlFor={name} className={styles.label}>
        {label}:
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className={styles.input}
      />
    </div>
  );

  return (
    <div className={styles.profile}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {renderFormField("Degree", "degree", formData.degree)}
        {renderFormField("Department", "department", formData.department)}
        {renderFormField("Areas of Interest", "interests", formData.interests)}
        {renderFormField(
          "College/Company",
          "institution",
          formData.institution
        )}
        {renderFormField("Skills & Expertise", "skills", formData.skills)}
        {renderFormField(
          "Current Activity",
          "currentActivity",
          formData.currentActivity
        )}
        <div className={styles.formGroup}>
          <label htmlFor="profileImage" className={styles.label}>
            Profile Image:
          </label>
          {formData.profileImage && !isEditingImage && (
            <img
              src={formData.profileImage}
              alt="Profile"
              className={styles.profileImage}
            />
          )}
          {isEditingImage && (
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={handleImageChange}
            />
          )}
          {!isEditingImage && (
            <button
              type="button"
              className={styles.editButton}
              onClick={() => setIsEditingImage(true)}
            >
              Edit Image
            </button>
          )}
        </div>
        {isEditing ? (
          <button type="submit" className={styles.button}>
            Save Changes
          </button>
        ) : (
          <button
            type="button"
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;
