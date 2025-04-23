import { useEffect, useRef, useState } from 'react';
import {useAuth} from '../Context/AuthContext';
const ROOM_ID = 'test-room';

const VideoWithRecording = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const recorderRef = useRef(null);
  const { token } = useAuth();
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [callStarted, setCallStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState([]);

  const rtcConfig = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    getDevices();

    // return () => {
    //   if (peerConnectionRef.current) peerConnectionRef.current.close();
    // };
  }, []);

  const getDevices = async () => {
    const all = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = all.filter(d => d.kind === 'videoinput');
    setDevices(videoInputs);
    setSelectedDeviceId(videoInputs[0]?.deviceId || '');
  };

  const startLocalVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: selectedDeviceId },
      audio: true,
    });
    localVideoRef.current.srcObject = stream;
    return stream;
  };



  // const handleSignalingData = async ({ type, offer, answer, candidate }) => {
  //   if (!peerConnectionRef.current) {
  //     const stream = await startLocalVideo();
  //     createPeerConnection(stream);
  //   }
  //   const pc = peerConnectionRef.current;
  //   switch (type) {
  //     case 'offer':
  //       await pc.setRemoteDescription(new RTCSessionDescription(offer));
  //       const ans = await pc.createAnswer();
  //       await pc.setLocalDescription(ans);
  //       signalingChannel.send(ROOM_ID, { type: 'answer', answer: ans });
  //       setCallStarted(true);
  //       break;
  //     case 'answer':
  //       await pc.setRemoteDescription(new RTCSessionDescription(answer));
  //       setCallStarted(true);
  //       break;
  //     case 'candidate':
  //       if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const initiateCall = async () => {
  //   const stream = await startLocalVideo();
  // };

  
  const startRecording = async () => {
    const stream = await startLocalVideo();
    const localStream = localVideoRef.current.srcObject;
    const remoteStream = remoteVideoRef.current.srcObject;
    
    const mixed = new MediaStream([
      ...localStream.getVideoTracks(),
      ...localStream.getAudioTracks(),
      // ...remoteStream.getAudioTracks(), lookup later
    ]);
    const options = { mimeType: 'video/webm; codecs=vp8,opus' };
    const mediaRecorder = new MediaRecorder(mixed, options);
    const buffer = [];

    mediaRecorder.ondataavailable = e => buffer.push(e.data);
    mediaRecorder.onstop = async () => {
      
      const blob = new Blob(buffer, { type: options.mimeType });
      await uploadRecording(blob);
    };

    mediaRecorder.start(1000);
    recorderRef.current = mediaRecorder;
    setChunks(buffer);
    setRecording(true);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
      setRecording(false);
    }
  };

  const uploadRecording = async blob => {
    const filename = `${Date.now()}-call.webm`;
   
    const presignRes = await fetch(
      `http://localhost:3000/api/videos/sign-s3`,
      { credentials: 'include',
        method: "POST",
        headers: {'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({filename})
       }
    );
    const { url, key } = await presignRes.json();
   
    const bucketAPI = await fetch(url, { method: 'PUT', body: blob });
    // const bucketResult = await bucketAPI.json();
    console.log(bucketAPI);
    
    
   
    const publicUrl = `http://foundra-bucket.s3.amazonaws.com/${key}`;
    const addVid = await fetch(`http://localhost:3000/api/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
       },
      credentials: 'include',
      body: JSON.stringify({ title: 'test', url: publicUrl }),
    });
    const addVidResult = await addVid.json();
    console.log(addVidResult);
    
    
    alert('Video uploaded successfully!');
  };

  return (
    <div>
      <div>
        <select
          value={selectedDeviceId}
          onChange={e => setSelectedDeviceId(e.target.value)}
          disabled={callStarted}
        >
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || d.deviceId}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
        <video ref={localVideoRef} autoPlay muted playsInline width="300" />
        <video ref={remoteVideoRef} autoPlay playsInline width="300" />
      </div>

        <button onClick={startRecording} disabled={!selectedDeviceId}>
          Start Call
        </button>
        <>
          <button onClick={startRecording} disabled={recording}>
            Start Recording
          </button>
          <button onClick={stopRecording} disabled={!recording} style={{ marginLeft: '0.5rem' }}>
            Stop Recording
          </button>
        </>
    </div>
  );
};

export default VideoWithRecording;