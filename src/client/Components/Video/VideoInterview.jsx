import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import VideoTranscriber from "./VideoTranscriber";
import Comments from "./Comments";
import "./Videos.css";

const VideoInterview = ({ setVideos }) => {
  const { token } = useAuth();
  const localVideoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState("");
  const [newVideoId, setNewVideoId] = useState(null);
  const recorderRef = useRef(null);
  const S3_BUCKET = 'foundra-bucket';

  useEffect(() => {
    (async () => {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(allDevices.filter(d => d.kind === "videoinput"));
    })();
  }, []);

  const startLocalVideo = async () => {
    if (!devices.length) return null;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: devices[0].deviceId },
      audio: true
    });
    localVideoRef.current.srcObject = stream;
    return stream;
  };

  const uploadRecording = async (blob) => {
    const filename = `${Date.now()}-interview.webm`;
    const signRes = await fetch(
      `http://localhost:3000/api/videos/sign-s3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ filename })
      }
    );
    if (!signRes.ok) throw new Error('Failed to get presigned URL');
    const { url: presignedUrl, key } = await signRes.json();

    const uploadRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": "video/webm" },
      body: blob
    });
    if (!uploadRes.ok) throw new Error('S3 upload failed');

    const publicUrl = `https://${S3_BUCKET}.s3.amazonaws.com/${key}`;
    const createRes = await fetch(
      `http://localhost:3000/api/videos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: filename, url: publicUrl, isPublic: true })
      }
    );
    if (!createRes.ok) throw new Error('Failed to create video record');
    const created = await createRes.json();
    console.log(created);
    
    setVideos((prevVideos) => [created, ...prevVideos]);
    // setRecordedUrl(URL.createObjectURL(blob));
    setNewVideoId(created.id);
  };

  const startRecording = async () => {
    const stream = await startLocalVideo();
    if (!stream) return;

    const mixed = new MediaStream([
      ...stream.getVideoTracks(),
      ...stream.getAudioTracks()
    ]);
    const recorder = new MediaRecorder(mixed, { mimeType: "video/webm; codecs=vp8,opus" });
    const buffer = [];

    recorder.ondataavailable = (e) => buffer.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(buffer, { type: "video/webm" });
      setRecordedUrl(URL.createObjectURL(blob));
      try {
        const created = await uploadRecording(blob);
        
        // console.log(created);
        
        // setNewVideoId(created.id);
      } catch (err) {
        console.error(err);
      }
      setRecording(false);
    };

    recorder.start(1000);
    recorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  };

  return (
    <div className="fullscreen-center-wrapper">
      <div className="video-interview-container">
        <h2 className="video-interview-heading">Record Your Interview</h2>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="video-preview"
        />

        <div className="record-button-container">
          {!recording ? (
            <button className="record-button" onClick={startRecording} disabled={recording || !devices.length}>
              Start Recording
            </button>
          ) : (
            <button className="record-button stop" onClick={stopRecording}>
              Stop Recording
            </button>
          )}
        </div>

        {recordedUrl && (
          <div className="recording-review-section">
            <h3>Review & Transcribe</h3>
            <VideoTranscriber src={recordedUrl} autoStart />
            {newVideoId && <Comments videoId={newVideoId} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoInterview;