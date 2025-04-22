import { useEffect, useRef, useState } from 'react';
import { Model, Recognizer } from 'vosk-browser';

const VideoTranscriber = () => {
  const videoRef = useRef(null);
  const [transcript, setTranscript] = useState('');
  const recognizerRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    const initRecognizer = async () => {
      const model = await Model.create('https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.tar.gz');
      recognizerRef.current = new Recognizer({ model, sampleRate: 16000 });
    };

    initRecognizer();
  }, []);

  const transcribeVideo = async () => {
    const video = videoRef.current;
    const stream = video.captureStream();
    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);

    const workletUrl = URL.createObjectURL(new Blob([`
      class TranscribeProcessor extends AudioWorkletProcessor {
        constructor() {
          super();
        }

        process(inputs) {
          const input = inputs[0];
          if (input.length > 0) {
            const channelData = input[0];
            this.port.postMessage(channelData);
          }
          return true;
        }
      }
      registerProcessor('transcribe-processor', TranscribeProcessor);
    `], { type: 'application/javascript' }));

    await audioContext.audioWorklet.addModule(workletUrl);
    const workletNode = new AudioWorkletNode(audioContext, 'transcribe-processor');

    workletNode.port.onmessage = (event) => {
      const audioData = Float32Array.from(event.data);
      if (recognizerRef.current.acceptWaveform(audioData)) {
        const result = recognizerRef.current.result();
        if (result.text) {
          setTranscript(prev => prev + ' ' + result.text);
        }
      }
    };

    source.connect(workletNode).connect(audioContext.destination);
    video.play();
  };

  return (
    <div>
      <video ref={videoRef} controls src="your-video.mp4"></video>
      <button onClick={transcribeVideo}>Transcribe Video</button>
      <h3>Transcript:</h3>
      <div>{transcript}</div>
    </div>
  );
};

export default VideoTranscriber;