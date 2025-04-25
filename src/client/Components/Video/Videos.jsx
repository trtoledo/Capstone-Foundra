import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import VideoInterview from "./VideoInterview";
import Comments from "./Comments";
import { fetchAllVideos } from "../../api/videos"; 
import "./Videos.css";

const Videos = () => {
  const { token } = useAuth();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await fetchAllVideos();
        setVideos(data || []);
      } catch (err) {
        console.error("Error loading videos:", err);
      }
    };

    loadVideos();
  }, []);

  return (
    <div className="videos-container">
      <div className="videos-header">Record a New Interview</div>
      <div className="video-interview-sections">
      <VideoInterview setVideos={setVideos} />
      </div>

      <div className="videos-header" style={{ marginTop: "2rem" }}>Your Previous Videos</div>
      {videos.length === 0 ? (
        <p className="empty-video-message">No videos found.</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <div
              key={video.id} className="video-card">
              <video
                src={video.url}
                controls
                className="video-thumbnail"
                />
                <div className="video-info">
                <h4 className="video-title">{video.title}</h4>
              <Comments videoId={video.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;