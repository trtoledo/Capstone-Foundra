import { useEffect, useRef, useState } from "react";
import * as vosk from "vosk-browser";

const VideoTranscriber = ({ src, autoStart = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const recognizerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const workletNodeRef = useRef(null);
  const [isRecognizerReady, setIsRecognizerReady] = useState(false);

  useEffect(() => {
    const initRecognizer = async () => {
      try {
        console.log("init");
        // vosk.setLogLevel(0);
        const model = await vosk.createModel("/vosk-model-small-en-us-0.15/");
        console.log('recognizer init');
        
        const recognizer = await vosk.createRecognizer(model, 16000);
        console.log('recognizer loaded');
        
        recognizer.setWords(true);
        recognizerRef.current = recognizer;
        console.log("Attempting to initialize recognizer...");
        console.log(recognizer);
        console.log(recognizerRef);
        
        
        setIsRecognizerReady(true);
        console.log("Recognizer initialized successfully!");
      } catch (error) {
        console.error("Error initializing recognizer:", error);
      }
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
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      console.warn("Video not ready to capture stream.");
      return;
    }
    const stream = video.captureStream();
    console.log("Audio Tracks After Capture:", stream.getAudioTracks());
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].onmute = () => console.warn("Audio track is muted!");
      audioTracks[0].onunmute = () => console.log("Audio track is unmuted!");
    }

    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;
    console.log("AudioContext State:", audioContextRef.current.state);

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
    `,
        ],
        { type: "application/javascript" }
      )
    );

    await audioContext.audioWorklet.addModule(workletUrl);
    const workletNode = new AudioWorkletNode(
      audioContext,
      "transcribe-processor"
    );
    workletNodeRef.current = workletNode;

    workletNode.port.onmessage = (event) => {
      if (!isRecognizerReady || !recognizerRef.current) {
        console.warn("Recognizer not yet ready, skipping audio chunk.");
        return;
      }

      console.log("Recognizer Ref in onmessage:", recognizerRef.current);

      const audioData = Float32Array.from(event.data);
      const accepted = recognizerRef.current.acceptWaveform(audioData);
      console.log("acceptWaveform returned:", accepted);

      if (accepted) {
        try {
          const result = recognizerRef.current.result();
          console.log("FINAL RESULT:", result);
          if (result && result.text) {
            setTranscript((prev) => prev + " " + result.text);
          }
        } catch (error) {
          console.error("Error getting final result:", error);
        }
      } else {
        try {
          const partial = recognizerRef.current.partialResult();
          console.log("PARTIAL RESULT:", partial);
          if (partial && partial.partial) {
            setTranscript((prev) => prev + " " + partial.partial);
          }
        } catch (error) {
          console.error("Error getting partial result:", error);
        }
      }
    };

    source.connect(analyser);
    analyser.connect(workletNode).connect(audioContext.destination);

    video.play();
    drawWaveform();

    const stopTranscription = async () => {
      console.log("Stopping transcription...");

      if (workletNodeRef.current) {
        workletNodeRef.current.disconnect();
        workletNodeRef.current = null;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }

      if (audioContextRef.current) {
        const ctx = audioContextRef.current;
        if (ctx.state !== "closed") {
          await ctx.close();
        }
        audioContextRef.current = null;
      }

      if (recognizerRef.current) {
        recognizerRef.current.free();
        recognizerRef.current = null;
      }
    };

    video.addEventListener("ended", stopTranscription);
    video.addEventListener("pause", stopTranscription);
  };

  useEffect(() => {
    if (autoStart && src && videoRef.current) {
      const video = videoRef.current;

      video.src = src;

      const handleLoaded = () => {
          const stream = video.captureStream();
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length > 0) {
            audioTracks[0].onmute = () => console.warn("Audio track is muted!");
            audioTracks[0].onunmute = () => console.log("Audio track is unmuted!");
          }
          transcribeVideo(stream);
      };

      video.addEventListener("loadedmetadata", handleLoaded);

      return () => video.removeEventListener("loadedmetadata", handleLoaded);
    }
  }, [src, autoStart]);

  useEffect(() => {
    console.log("TRANSCRIPT UPDATED:", transcript);
  }, [transcript]);

  return (
    <div style={{ background: "#000", color: "#fff", padding: "1rem" }}>
      <video ref={videoRef} controls src={src} style={{ width: "100%" }} />
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
      <div
        style={{
          background: "red",
          minHeight: "100px",
          padding: "1rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {transcript}
      </div>
    </div>
  );
};

export default VideoTranscriber;