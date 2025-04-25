import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { token, user, setUser, loading, role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    bio: "",
    avatarUrl: "",
    resumeUrl: "",
  });

  useEffect(() => {
    if (user) {
      setNewUserData({
        username: user.username || "",
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

    if (!newUserData.username || !newUserData.email) {
      alert("Username and email are required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUserData),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("An error occurred while updating your profile");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const response = await fetch(
      "http://localhost:3000/api/users/sign-s3-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename: file.name }),
      }
    );

    const { url, key } = await response.json();
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const updatedUser = await fetch(
      `http://localhost:3000/api/users/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatarUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
        }),
      }
    ).then((res) => res.json());

    setUser(updatedUser);
    alert("Avatar updated successfully!");
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const response = await fetch(
      "http://localhost:3000/api/resumes/sign-s3-resume",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename: file.name }),
      }
    );

    const { url, key } = await response.json();
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const updatedUser = await fetch(
      `http://localhost:3000/api/users/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
        }),
      }
    ).then((res) => res.json());

    setUser(updatedUser);
    alert("Resume uploaded successfully!");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="account-settings-container">
      <h2>Profile</h2>

      {/* Avatar Upload Section */}
      <div className="avatar-upload-container">
        <label htmlFor="avatar-upload">Upload Avatar</label>
        <input type="file" id="avatar-upload" onChange={handleAvatarUpload} />
        <img
          src={user?.avatarUrl || "default-avatar.png"}
          alt="Profile Avatar"
          className="avatar-preview"
        />
      </div>

      {/* Resume Upload Section */}
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

      {/* Profile Info or Editing Form */}
      {isEditing ? (
        <form onSubmit={handleUpdateProfile}>
          <div className="input-section">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={newUserData.username}
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
            <strong>Username:</strong> {user?.username}
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
