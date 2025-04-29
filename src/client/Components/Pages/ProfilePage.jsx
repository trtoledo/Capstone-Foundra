import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { updateUser } from "../../api/users";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { token, user, setUser, loading, role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    bio: "",
    avatarUrl: "",
    resumeUrl: "",
  });
  const S3_BUCKET = "foundra-bucket";

  useEffect(() => {
    if (user) {
      setNewUserData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        resumeUrl: user.resumeUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!newUserData.name || !newUserData.email) {
      alert("Name and email are required");
      return;
    }

    try {
      const updatedUser = await updateUser(
        user.id,
        newUserData.name,
        newUserData.companyId,
        newUserData.email,
        newUserData.bio,
        newUserData.avatarUrl,
        newUserData.resumeUrl,
        token
      );

      if (updatedUser) {
        setUser(updatedUser);
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("An error occurred while updating your profile");
    }
  };

  const uploadFileAndGetUrl = async (endpoint, file) => {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ filename: file.name }),
    });

    const { url, key } = await response.json();

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    return `https://${S3_BUCKET}.s3.amazonaws.com/${key}`;
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const avatarUrl = await uploadFileAndGetUrl("/api/users/sign-s3-profile", file);

      const updatedUser = await updateUser(
        user.id,
        newUserData.name,
        newUserData.companyId,
        newUserData.email,
        newUserData.bio,
        avatarUrl,
        newUserData.resumeUrl,
        token
      );

      setUser(updatedUser);
      setNewUserData((prev) => ({ ...prev, avatarUrl }));
      alert("Avatar updated successfully!");
    } catch (err) {
      console.error("Error uploading avatar:", err);
      alert("Failed to upload avatar");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const resumeUrl = await uploadFileAndGetUrl("/api/resumes/sign-s3-resume", file);

      const updatedUser = await updateUser(
        user.id,
        newUserData.name,
        newUserData.companyId,
        newUserData.email,
        newUserData.bio,
        newUserData.avatarUrl,
        resumeUrl,
        token
      );

      setUser(updatedUser);
      setNewUserData((prev) => ({ ...prev, resumeUrl }));
      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error("Error uploading resume:", err);
      alert("Failed to upload resume");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="account-settings-container">
      <h2>Profile</h2>

      <div className="avatar-upload-container">
        <label htmlFor="avatar-upload">Upload Avatar</label>
        <input type="file" id="avatar-upload" onChange={handleAvatarUpload} />
        <img
          src={user?.avatarUrl || "/assets/flounder_foundra.jpg"}
          alt="Profile Avatar"
          className="avatar-preview"
        />
      </div>

      <div className="resume-upload-container">
        <label htmlFor="resume-upload">Upload Resume (PDF)</label>
        <input
          type="file"
          id="resume-upload"
          accept=".pdf"
          onChange={handleResumeUpload}
        />
        {user?.resumeUrl && (
          <p>
            Current resume:{" "}
            <a
              href={user.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-view-button"
            >
              View Resume
            </a>
          </p>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdateProfile}>
          <div className="input-section">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newUserData.name}
              onChange={handleChange}
            />
          </div>
          <div className="input-section">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUserData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-section">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={newUserData.bio}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </form>
      ) : (
        <div className="user-info">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Bio:</strong> {user?.bio}
          </p>
          <button onClick={() => setIsEditing(true)} className="save-button">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;