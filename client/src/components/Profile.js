// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import styles from "./Profile.module.css";

// const Profile = () => {
//   const { state } = useLocation();
//   const [username, setUsername] = useState("");

//   const [formData, setFormData] = useState({
//     degree: "",
//     department: "",
//     interests: "",
//     institution: "",
//     skills: "",
//     currentActivity: "",
//   });

//   useEffect(() => {
//     if (state && state.username) {
//       setUsername(state.username);
//       fetchProfileData(state.username);
//     }
//   }, [state]);

//   const fetchProfileData = async (username) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/profile/${username}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setFormData(data);
//       } else {
//         console.error("Failed to fetch profile data");
//       }
//     } catch (error) {
//       console.error("Error fetching profile data:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const dataToSend = {
//       username,
//       ...formData,
//     };

//     try {
//       const response = await fetch("http://localhost:8000/api/profile", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       if (response.ok) {
//         console.log("Profile submitted successfully");
//       } else {
//         console.log("Failed to submit profile");
//       }
//     } catch (error) {
//       console.error("Error submitting profile:", error);
//     }
//   };

//   return (
//     <div className={styles.profile}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <div className={styles.formGroup}>
//           <label htmlFor="degree" className={styles.label}>
//             Degree:
//           </label>
//           <input
//             type="text"
//             id="degree"
//             name="degree"
//             value={formData.degree}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="department" className={styles.label}>
//             Department:
//           </label>
//           <input
//             type="text"
//             id="department"
//             name="department"
//             value={formData.department}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="interests" className={styles.label}>
//             Areas of Interest:
//           </label>
//           <input
//             type="text"
//             id="interests"
//             name="interests"
//             value={formData.interests}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="institution" className={styles.label}>
//             College/Company:
//           </label>
//           <input
//             type="text"
//             id="institution"
//             name="institution"
//             value={formData.institution}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="skills" className={styles.label}>
//             Skills & Expertise:
//           </label>
//           <input
//             type="text"
//             id="skills"
//             name="skills"
//             value={formData.skills}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="currentActivity" className={styles.label}>
//             Current Activity:
//           </label>
//           <input
//             type="text"
//             id="currentActivity"
//             name="currentActivity"
//             value={formData.currentActivity}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>
//         <button type="submit" className={styles.button}>
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const { state } = useLocation();
  const [username, setUsername] = useState("");

  const [formData, setFormData] = useState({
    degree: "",
    department: "",
    interests: "",
    institution: "",
    skills: "",
    currentActivity: "",
  });

  const [editableFields, setEditableFields] = useState({
    degree: false,
    department: false,
    interests: false,
    institution: false,
    skills: false,
    currentActivity: false,
  });

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

  const handleEditClick = (field) => {
    setEditableFields({
      ...editableFields,
      [field]: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      username,
      ...formData,
    };

    try {
      const response = await fetch("http://localhost:8000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        console.log("Profile submitted successfully");
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
        disabled={!editableFields[name]}
      />
      {!editableFields[name] && (
        <button
          type="button"
          className={styles.editButton}
          onClick={() => handleEditClick(name)}
        >
          Edit
        </button>
      )}
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
        <button type="submit" className={styles.button}>
          Update my profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
