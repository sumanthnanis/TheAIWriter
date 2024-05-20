import { useLocation } from "react-router-dom";
import styles from "./Profile.module.css";
import React, { useEffect, useState } from "react";

const ProfileDetails = () => {
  const { state } = useLocation();
  const [profileData, setProfileData] = useState(null);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/profile/${state.username}`
      );
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    if (state.username) {
      fetchProfileData();
    }
  }, [state.username]);

  if (!profileData) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.profileDetails}>
      <div className={styles.profileItem}>
        <strong>Username:</strong> {profileData.username}
      </div>
      <div className={styles.profileItem}>
        <strong>Degree:</strong> {profileData.degree}
      </div>
      <div className={styles.profileItem}>
        <strong>Department:</strong> {profileData.department}
      </div>
      <div className={styles.profileItem}>
        <strong>Institution:</strong> {profileData.institution}
      </div>
    </div>
  );
};

export default ProfileDetails;
