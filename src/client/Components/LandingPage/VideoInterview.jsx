// src/client/Components/LandingPage/VideoInterview.jsx
import React from "react";
import "./VideoInterview.css";

export default function VideoInterview() {
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
      ></ziggeorecorder>
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












