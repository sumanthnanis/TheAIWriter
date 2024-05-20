import EditProfile from "./EditProfile";
import UserFiles from "./UserFiles";
import AuthorPapers from "./AuthorPapers";
import { useLocation } from "react-router-dom";
import styles from "./Profile.module.css";
import React, { useEffect, useState } from "react";
import ProfileDetails from "./ProfileDetails";

const Profile = () => {
  return (
    <div>
      <div>
        <ProfileDetails />
      </div>
      <div>
        <EditProfile />
      </div>
      <div>
        <UserFiles />
      </div>
      <div>
        <AuthorPapers />
      </div>
    </div>
  );
};

export default Profile;
