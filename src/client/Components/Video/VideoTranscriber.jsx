import React, { useEffect, useRef, useState } from "react";
import { createModel, createRecognizer } from "vosk-browser";

const VideoTranscriber = ({ src, autoStart = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognizerRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [transcript, setTranscript] = useState("");
  const [isRecognizerReady, setIsRecognizerReady] = useState(false);

  // 1) Initialize Vosk model & recognizer
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        console.log("📥 Loading Vosk model…");
        const model = await createModel("/models/vosk-model-small-en-us-0.15.tar.gz");
        console.log("✅ Model loaded, creating recognizer…");
        const recognizer = await createRecognizer(model, 16000);

        // Hook up the events
        recognizer.on("result", (msg) => {
          if (msg.result && msg.result.text) {
            setTranscript((prev) => prev + " " + msg.result.text);
          }
        });
        recognizer.on("partialresult", (msg) => {
          if (msg.result && msg.result.partial) {
            // replace trailing partial
            setTranscript((prev) => {
              // drop any previous partial, then append
              const noPartial = prev.replace(/ *\[[^]*\]$/, "");
              return noPartial + " [" + msg.result.partial + "]";
            });
          }
        });

        if (!cancelled) {
          recognizerRef.current = recognizer;
          setIsRecognizerReady(true);
          console.log("🎤 Recognizer ready!");
        }
      } catch (err) {
        console.error("❌ Vosk init error:", err);
      }
    })();

    return () => {
      cancelled = true;
      if (recognizerRef.current) {
        recognizerRef.current.free();
        recognizerRef.current = null;
      }
    };
  }, []);

  // 2) Draw audio waveform (unchanged)
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const analyser = audioContextRef.current?.createAnalyser
      ? audioContextRef.current.createAnalyser()
      : null;
    if (!analyser) return;
    analyser.fftSize = 2048;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0ff";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#0ff";

      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  // 3) Start transcription
  const transcribeVideo = async () => {
    if (!isRecognizerReady || !recognizerRef.current) {
      console.warn("🕒 Recognizer not ready yet.");
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      await new Promise((r) => video.play().then(r).catch(r));
      video.pause();
    }

    const stream = video.captureStream();
    const audioCtx = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      recognizerRef.current.acceptWaveform(e.inputBuffer);
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);

    video.play();
    drawWaveform();

    // Stop when video ends or pauses
    const cleanup = async () => {
      processor.disconnect();
      source.disconnect();
      cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current.state !== "closed") {
        await audioContextRef.current.close();
      }
    };
    video.addEventListener("ended", cleanup);
    video.addEventListener("pause", cleanup);
  };

  // autoStart if asked
  useEffect(() => {
    if (autoStart && src && videoRef.current && isRecognizerReady) {
      transcribeVideo();
    }
  }, [autoStart, src, isRecognizerReady]);

  return (
    <div style={{ background: "#000", color: "#fff", padding: "1rem" }}>
      <video
        ref={videoRef}
        controls
        src={src}
        style={{ width: "100%", background: "#000" }}
      />
      {!autoStart && (
        <button
          onClick={transcribeVideo}
          disabled={!isRecognizerReady}
          style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}
        >
          {isRecognizerReady ? "Transcribe Video" : "Loading Model…"}
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
          borderRadius: 10,
          boxShadow: "0 0 20px #0ff, inset 0 0 40px #0ff",
        }}
      />
      <h3>Transcript:</h3>
      <div
        style={{
          background: "#222",
          minHeight: 100,
          padding: "1rem",
          whiteSpace: "pre-wrap",
          borderRadius: 4,
        }}
      >
        {transcript}
      </div>
    </div>
  );
};

export default VideoTranscriber;