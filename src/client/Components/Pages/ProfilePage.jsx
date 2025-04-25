import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import './ProfilePage.css';

const ProfilePage = () => {
  const { token, user, setUser, loading, role } = useAuth(); 
  const [isEditing, setIsEditing] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    bio: "",
    avatarUrl: "", 
  });

  useEffect(() => {
    if (user) {
      setNewUserData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
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
      const response = await fetch(`http://localhost:3000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUserData),
      });

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

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("http://localhost:3000/api/users/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser); 
        alert("Avatar updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to upload avatar");
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
      alert("An error occurred while uploading your avatar");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="account-settings-container">
      <h2>Account Settings</h2>
      
      {/* Avatar Upload Section */}
      <div className="avatar-upload-container">
        <div>
          <label htmlFor="avatar-upload">Upload Avatar</label>
          <input
            type="file"
            id="avatar-upload"
            onChange={handleAvatarUpload}
          />
        </div>
        
        <div>
          <img
            src={user?.avatarUrl || "default-avatar.png"}
            alt="Profile Avatar"
            className="avatar-preview"
          />
        </div>
      </div>
  
      {/* Profile Editing Form */}
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
  
          <button type="submit" className="save-button">Save Changes</button>
        </form>
      ) : (
        <div className="user-info">
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Bio:</strong> {user?.bio}</p>
          <button onClick={() => setIsEditing(true)} className="save-button">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;