import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import VideoTranscriber from "./VideoTranscriber";
import Comments from "./Comments";

const VideoInterview = () => {
  const { token } = useAuth();
  const localVideoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState("");
  const [newVideoId, setNewVideoId] = useState(null);
  const recorderRef = useRef(null);

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

    const publicUrl = `https://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com/${key}`;
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
    return await createRes.json();
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
      try {
        const created = await uploadRecording(blob);
        setRecordedUrl(URL.createObjectURL(blob));
        setNewVideoId(created.id);
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
    <div>
      <h2>Record Your Interview</h2>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "320px", height: "240px", background: "#000" }}
      />

      <div style={{ margin: "1rem 0" }}>
        {!recording ? (
          <button onClick={startRecording} disabled={recording || !devices.length}>
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording}>
            Stop Recording
          </button>
        )}
      </div>

      {recordedUrl && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Review & Transcribe</h3>
          <VideoTranscriber src={recordedUrl} autoStart />
          {newVideoId && <Comments videoId={newVideoId} />}
        </div>
      )}
    </div>
  );
};

export default VideoInterview;