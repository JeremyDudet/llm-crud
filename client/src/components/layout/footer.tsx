// src/components/layout/footer.tsx
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mic, Headphones, Send } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import apiClient from "@/api/apiClient";

// Type declarations (unchanged)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function Footer() {
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px"; // Reset to default height
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = scrollHeight + "px";
      if (scrollHeight > 300) {
        textarea.style.height = "300px";
      }
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsTyping(newValue.length > 0);
      adjustTextareaHeight();
    },
    [adjustTextareaHeight]
  );

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  useEffect(() => {
    window.addEventListener("resize", adjustTextareaHeight);
    return () => window.removeEventListener("resize", adjustTextareaHeight);
  }, [adjustTextareaHeight]);

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");

          setInputValue(transcript);
          setIsTyping(transcript.length > 0);
          adjustTextareaHeight();
        };
      }
    }
  }, [adjustTextareaHeight]);

  const processVoiceCommand = useCallback(
    async (audioBlob: Blob) => {
      setIsTranscribing(true);
      setError(null);
      try {
        console.log("Audio blob size:", audioBlob.size);

        const formData = new FormData();
        formData.append("audio", audioBlob, "voice_command.wav");
        formData.append("fileExtension", "wav");

        console.log("FormData entries:");
        for (const [key, value] of formData.entries()) {
          console.log(
            key,
            value instanceof Blob ? `Blob of size ${value.size}` : value
          );
        }

        const response = await apiClient.post(
          "/api/transcribe-audio",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Server response:", response);
        console.log("Response data:", response.data);
        console.log("Transcribed text:", response.data.text);

        if (response.data.text) {
          setInputValue(response.data.text);
          setIsTyping(response.data.text.length > 0);
          adjustTextareaHeight();
        } else {
          setError("Transcription failed: Empty response from server");
        }
      } catch (error) {
        console.error("Error processing voice command:", error);
        if (error instanceof Error) {
          setError(`Error: ${error.message}`);
          if (error.message.includes("Network Error")) {
            console.log(
              "Possible CORS issue. Check server CORS configuration."
            );
          }
        } else {
          setError(
            "An unknown error occurred while processing the voice command"
          );
        }
      } finally {
        setIsTranscribing(false);
      }
    },
    [adjustTextareaHeight]
  );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await processVoiceCommand(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      // Handle the error (e.g., show a notification to the user)
    }
  }, [processVoiceCommand]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const handleSend = useCallback(() => {
    // Implement send functionality
    console.log("Sending message:", inputValue);
    // Reset the textarea
    setInputValue("");
    setIsTyping(false);
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  return (
    <div className="w-full px-4 pb-4 bg-background">
      <div
        className="flex space-x-2 pt-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {!isTyping && (
          <>
            <Button
              variant="secondary"
              className="flex-shrink-0 h-12 bg-secondary/80 text-secondary-foreground"
            >
              <span className="truncate">
                Tell me the country with the most Olympic athletes
              </span>
            </Button>
            <Button
              variant="secondary"
              className="flex-shrink-0 h-12 bg-secondary/80 text-secondary-foreground"
            >
              <span className="truncate">Give me tips to overcome procr</span>
            </Button>
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Message"
          className="flex-grow bg-background max-h-[300px] overflow-y-auto w-full resize-none"
          style={{
            minHeight: "40px", // Set a minimum height
            height: "40px", // Set initial height
            maxHeight: "300px",
            overflowX: "hidden", // Hide horizontal scrollbar
            overflowY: "auto", // Show vertical scrollbar when needed
            whiteSpace: "pre-wrap", // Preserve line breaks and wrap text
            wordWrap: "break-word", // Break long words if necessary
          }}
        />
        {isTyping ? (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              className={`shrink-0 ${
                isListening
                  ? "bg-red-400 text-white hover:bg-red-500 hover:text-white"
                  : ""
              }`}
              onClick={isListening ? stopRecording : startRecording}
              disabled={isTranscribing}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="shrink-0">
              <Headphones className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {isTranscribing && (
        <div className="text-sm text-gray-500 mt-2">Transcribing audio...</div>
      )}
      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
    </div>
  );
}
