// src/components/VoiceInput.tsx
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { useVoiceCommand } from "../hooks/useVoiceCommand";

const VoiceInput: React.FC = () => {
  const {
    isListening,
    startListening,
    stopListening,
    processVoiceCommand,
    isProcessing,
    error,
  } = useVoiceCommand();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const handleStartListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        await processVoiceCommand(audioBlob);
        setAudioChunks([]);
      };
      mediaRecorderRef.current.start();
      startListening();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const handleStopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      stopListening();
    }
  };

  return (
    <div>
      <Button
        onClick={isListening ? handleStopListening : handleStartListening}
        disabled={isProcessing}
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </Button>
      {isProcessing && <p>Processing voice command...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default VoiceInput;
