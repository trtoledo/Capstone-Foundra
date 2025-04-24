import React, { useEffect, useRef, useState } from "react";
import { Model, Recognizer } from "vosk-browser";

const VideoTranscriber = ({ src, autoStart = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const recognizerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const initRecognizer = async () => {
      const model = await Model.create(
        "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.tar.gz"
      );
      recognizerRef.current = new Recognizer({ model, sampleRate: 16000 });
    };
    initRecognizer();
  }, []);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = "#000";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#00ffff";
      canvasCtx.shadowBlur = 15;
      canvasCtx.shadowColor = "#00ffff";

      canvasCtx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  const transcribeVideo = async () => {
    const video = videoRef.current;
    const stream = video.captureStream();
    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    const workletUrl = URL.createObjectURL(
      new Blob(
        [
          `
      class TranscribeProcessor extends AudioWorkletProcessor {
        process(inputs) {
          const input = inputs[0];
          if (input.length > 0) {
            this.port.postMessage(input[0]);
          }
          return true;
        }
      }
      registerProcessor('transcribe-processor', TranscribeProcessor);
    `],
        { type: "application/javascript" }
      )
    );

    await audioContext.audioWorklet.addModule(workletUrl);
    const workletNode = new AudioWorkletNode(
      audioContext,
      "transcribe-processor"
    );

    workletNode.port.onmessage = (event) => {
      const audioData = Float32Array.from(event.data);
      if (recognizerRef.current.acceptWaveform(audioData)) {
        const result = recognizerRef.current.result();
        if (result.text) {
          setTranscript((prev) => prev + " " + result.text);
        }
      }
    };

    source.connect(analyser);
    analyser.connect(workletNode).connect(audioContext.destination);

    video.play();
    drawWaveform();
  };

  useEffect(() => {
    if (autoStart && src && videoRef.current) {
      videoRef.current.src = src;
      transcribeVideo();
    }
  }, [src, autoStart]);

  return (
    <div style={{ background: "#000", color: "#fff", padding: "1rem" }}>
      <video
        ref={videoRef}
        controls
        src={src}
        style={{ width: "100%" }}
      />
      {!autoStart && (
        <button onClick={transcribeVideo} style={{ marginTop: "1rem" }}>
          Transcribe Video
        </button>
      )}
      <canvas
        ref={canvasRef}
        width="800"
        height="200"
        style={{
          display: "block",
          margin: "1rem 0",
          background: "#111",
          borderRadius: "10px",
          boxShadow: "0 0 20px #0ff, 0 0 40px #0ff inset",
        }}
      />
      <h3>Transcript:</h3>
      <div>{transcript}</div>
    </div>
  );
};

export default VideoTranscriber;