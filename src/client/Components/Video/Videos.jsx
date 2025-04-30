import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import VideoInterview from "./VideoInterview";
import Comments from "./Comments";
import { fetchAllVideos, deleteVideo } from "../../api/videos";
import ConfirmModal from "./ConfirmModal";
import { useRef } from "react";
import "./Videos.css";

const Videos = () => {
  const { token, user, role, setRefresh } = useAuth();
  const [videos, setVideos] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    const scrollAmount = 1150;
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

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

  const handleDeleteRequest = (videoId) => {
    setVideoToDelete(videoId);
    setIsModalOpen(true);
  };

  const handleDelete = async (videoId) => {
    try {
      console.log(token);

      await deleteVideo(videoId, token);

      setVideos((prevVideos) =>
        prevVideos.filter((v) => v.id !== videoToDelete)
      );
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error deleting video:", err);
    } finally {
      setDeletingId(null);
      setIsModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="videos-container">
      <div className="videos-header">Record a New Interview</div>
      <div className="video-interview-sections">
        <VideoInterview setVideos={setVideos} />
      </div>

      <div className="videos-header" style={{ marginTop: "2rem" }}>
        Your Previous Videos
      </div>
      {videos.length === 0 ? (
        <p className="empty-video-message">No videos found.</p>
      ) : (
        <div className="video-carousel-container">
          <button
            style={{ width: 100, margin: 0 }}
            className="carousel-button left"
            onClick={() => scrollCarousel(-1)}
          >
            &#8592;
          </button>

          <div className="video-carousel" ref={carouselRef}>
            {videos.map((video) => (
              <div key={video.id} className="video-card">
                <video style={{height: 500}} src={video.url} controls className="video-thumbnail" />
                <div className="video-info">
                  <h4 className="video-title">{video.title}</h4>
                  <Comments videoId={video.id} />
                  {(user?.id === video.userId || role === "admin") && (
                    <button
                      style={{ width: 100, margin: 0 }}
                      className="delete-button"
                      onClick={() => handleDelete(video.id)}
                      disabled={deletingId === video.id}
                    >
                      {deletingId === video.id ? (
                        <span className="loader"></span>
                      ) : (
                        "Delete Video"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            style={{ width: 100, margin: 0 }}
            className="carousel-button right"
            onClick={() => scrollCarousel(1)}
          >
            &#8594;
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this video?"
      />
    </div>
  );
};

export default Videos;
