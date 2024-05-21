import EditProfile from "./EditProfile";
import UserFiles from "./UserFiles";

import Navbar from "./Navbar";

import React from "react";
import ProfileDetails from "./ProfileDetails";

const Profile = () => {
  return (
    <div>
      <div>
        <Navbar state="profile" />
      </div>
      <div>
        <ProfileDetails />
      </div>
      <div>
        <EditProfile />
      </div>
      <div>
        <UserFiles />
      </div>
    </div>
  );
};

export default Profile;
