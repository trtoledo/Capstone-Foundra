import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import "./VideoInterview.css";

export default function VideoInterview() {
  const { user } = useAuth();
  const [isZiggeoReady, setIsZiggeoReady] = useState(false);
  const recorderRef = useRef(null);

  useEffect(() => {
    const scriptId = "ziggeo-sdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://assets.ziggeo.com/v2-stable/ziggeo.js";
      script.async = true;
      script.id = scriptId;
      script.onload = () => {
        console.log("Ziggeo SDK loaded successfully.");
        setIsZiggeoReady(true);  // Ziggeo is ready to use
      };
      script.onerror = () => {
        console.error("Error loading Ziggeo SDK.");
      };
      document.body.appendChild(script);
    } else {
      setIsZiggeoReady(true); // SDK is already loaded
    }
  }, []);

  useEffect(() => {
    if (isZiggeoReady && window.ZiggeoApi) {
      console.log("Ziggeo SDK is ready, initializing recorder...");
      window.ziggeoApp = new ZiggeoApi.V2.Application({
        token: "840570ba56dbe57af25a85cdc55d18ca",
        webrtc_streaming_if_necessary: true,
        webrtc_on_mobile: true,
        debug: true,
      });

      if (recorderRef.current) {
        ZiggeoApi.V2.Recorder.findByElement(recorderRef.current);
      }

      window.handleUploadSuccess = handleUploadSuccess;
      window.handleRecorded = handleRecorded;
    } else {
      console.error("ZiggeoApi not available.");
    }
  }, [isZiggeoReady]);

  const handleUploadSuccess = (data) => {
    console.log("Video uploaded successfully:", data);
    const videoToken = data.video.token;
    localStorage.setItem("uploadedVideoToken", videoToken);
    alert(`Video uploaded with token: ${videoToken}. You can now submit it.`);
  };

  const handleRecorded = (data) => {
    console.log("Video recorded:", data);
    const videoToken = data.video.token;
    localStorage.setItem("recordedVideoToken", videoToken);
    alert(`Video recorded with token: ${videoToken}. You can now submit it.`);
  };

  const handleSubmitVideo = () => {
    const uploadedToken = localStorage.getItem("uploadedVideoToken");
    const recordedToken = localStorage.getItem("recordedVideoToken");
    const videoToken = uploadedToken || recordedToken;

    if (!videoToken) {
      alert("No video has been recorded or uploaded yet.");
      return;
    }

    fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: videoToken, user_id: user.id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit video.");
        return res.json();
      })
      .then((data) => {
        alert("Video submitted successfully!");
        console.log("Video saved:", data);
        localStorage.removeItem("uploadedVideoToken");
        localStorage.removeItem("recordedVideoToken");
      })
      .catch((err) => {
        console.error("Error submitting video:", err);
        alert(err.message);
      });
  };

  return (
    <div className="video-interview" style={styles.container}>
      <h2 style={styles.heading}>Record or Upload Your Introduction</h2>

      <div
        ref={recorderRef}
        className="ziggeo-recorder"
        data-theme="modern"
        data-width="640"
        data-height="480"
        data-responsive="true"
        data-allowupload="true"
        data-allowrecord="true"
        data-allowselect="true"
        data-timelimit="60"
        data-theme-color="#DAFFED"
        data-title="Upload or Record your intro!"
        data-app="840570ba56dbe57af25a85cdc55d18ca"
        data-onuploadsuccess="handleUploadSuccess"
        data-onrecorded="handleRecorded"
        style={styles.recorder}
      ></div>

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
  },
};