import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import VideoInterview from "./VideoInterview";
import Comments from "./Comments";
import { fetchAllVideos } from "../../api/videos"; 

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
    <div style={{ padding: "2rem" }}>
      <h3>Record a New Interview</h3>
      <VideoInterview />

      <h3 style={{ marginTop: "3rem" }}>Your Previous Videos</h3>
      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginTop: "1rem",
          }}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                background: "#fafafa",
              }}
            >
              <h4>{video.title}</h4>
              <video
                src={video.url}
                controls
                style={{ width: "100%", borderRadius: "4px" }}
              />
              <Comments videoId={video.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;