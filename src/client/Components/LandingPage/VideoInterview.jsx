import React, { useEffect } from "react";
import "./VideoInterview.css";

export default function VideoInterview() {
  useEffect(() => {
    if (!window.ziggeoApp) {
      window.ziggeoApp = new ZiggeoApi.V2.Application({
        token: "840570ba56dbe57af25a85cdc55d18ca",
        webrtc_streaming_if_necessary: true,
        webrtc_on_mobile: true,
        debug: true
      });
    }
  }, []);

  const handleUploadSuccess = (data) => {
    console.log("Video uploaded successfully:", data);
    const videoToken = data.video.token;
    localStorage.setItem('uploadedVideoToken', videoToken);
    alert(`Video uploaded with token: ${videoToken}. You can now submit it.`);
  };

  const handleRecorded = (data) => {
    console.log("Video recorded:", data);
    const videoToken = data.video.token;
    localStorage.setItem('recordedVideoToken', videoToken);
    alert(`Video recorded with token: ${videoToken}. You can now submit it.`);
  };

  const handleSubmitVideo = () => {
    const uploadedToken = localStorage.getItem('uploadedVideoToken');
    const recordedToken = localStorage.getItem('recordedVideoToken');
    const videoToken = uploadedToken || recordedToken;

    if (!videoToken) {
      alert("No video has been recorded or uploaded yet.");
      return;
    }

    const userId = 'user123'; // Replace with your actual user identification logic

    fetch("/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: videoToken,
        user_id: userId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "Failed to submit video.");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Video information saved on the server:", data);
        alert("Video submitted successfully!");
        localStorage.removeItem('uploadedVideoToken');
        localStorage.removeItem('recordedVideoToken');
      })
      .catch((error) => {
        console.error("Error submitting video:", error);
        alert(error.message);
      });
  };

  return (
    <div className="video-interview" style={styles.container}>
      <h2 style={styles.heading}>Record or Upload Your Introduction</h2>

      <ziggeorecorder
        ziggeo-theme="modern"
        ziggeo-width="640"
        ziggeo-height="480"
        ziggeo-responsive="true"
        ziggeo-allowupload="true"
        ziggeo-allowrecord="true"
        ziggeo-allowselect="true"
        ziggeo-timelimit="60"
        ziggeo-theme-color="#DAFFED"
        ziggeo-title="Upload or Record your intro!"
        style={styles.recorder}
        onuploadsuccess={handleUploadSuccess} // Using lowercase event names
        onrecorded={handleRecorded}         // Using lowercase event names
        ziggeo-app="840570ba56dbe57af25a85cdc55d18ca" // Added ziggeo-app attribute
      ></ziggeorecorder>

      <button style={styles.submitButton} onClick={handleSubmitVideo}>
        Submit Video
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
  },
  heading: {
    marginBottom: "1rem",
    fontSize: "1.75rem",
    color: "#DAFFED",
  },
  recorder: {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    marginBottom: "1rem",
  },
  submitButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#5cb85c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    '&:hover': {
      backgroundColor: "#4cae4c",
    },
  },
};





 // ===========================
      // 💾 PSEUDOCODE for PERN:
      // fetch("/api/videos", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     token,
      //     url: videoURL,
      //     user_id: currentUser.id // or however you're managing users
      //   })
      // });
      // ===========================


// POST /api/videos
// router.post("/videos", async (req, res) => {
//     const { token, url } = req.body;
//     try {
//       await pool.query(
//         "INSERT INTO videos (ziggeo_token, video_url) VALUES ($1, $2)",
//         [token, url]
//       );
//       res.status(201).json({ message: "Video saved" });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Database error" });
//     }
//   });

// CREATE TABLE videos (
//     id SERIAL PRIMARY KEY,
//     ziggeo_token TEXT NOT NULL,
//     video_url TEXT NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );












