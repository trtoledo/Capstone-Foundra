// src/components/VideoInterview.jsx
import React, { useEffect } from "react";
import "./VideoInterview.css";

export default function VideoInterview() {
  useEffect(() => {
    // Initialize Ziggeo once
    if (!window.ziggeoApp) {
      window.ziggeoApp = new ZiggeoApi.V2.Application({
        token: "840570ba56dbe57af25a85cdc55d18ca", // ✅ your token
        webrtc_streaming_if_necessary: true,
        webrtc_on_mobile: true,
        debug: false,
      });
    }

    const recorder = document.querySelector("ziggeorecorder");

    const handleVerified = (e) => {
      const token = e.detail.video.token;
      const videoURL = `https://video-cdn.ziggeo.com/${token}/video.mp4`;
      console.log("🎬 New Video Recorded:", videoURL);

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
    };

    if (recorder && !recorder.dataset.listenerAttached) {
      recorder.addEventListener("verified", handleVerified);
      recorder.dataset.listenerAttached = "true";
    }

    return () => {
      if (recorder) recorder.removeEventListener("verified", handleVerified);
    };
  }, []);

  return (
    <div className="video-interview-wrapper">
      <h2>🎤 Record Your Intro</h2>
      <div className="recorder-box">
        <ziggeorecorder
          ziggeo-theme="modern"
          ziggeo-width="480"
          ziggeo-height="360"
          ziggeo-timelimit="60"
          ziggeo-theme-color="#DAFFED"
          ziggeo-title="Tell us about yourself!"
          ziggeo-allowrecord="true"
          ziggeo-allowupload="true"
          ziggeo-allowselect="false"
          ziggeo-responsive
        />
      </div>
    </div>
  );
}


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












