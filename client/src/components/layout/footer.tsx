// src/components/layout/footer.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useMicVAD } from "@ricky0123/vad-react";
import apiClient from "@/api/apiClient";
import { useDispatch } from "react-redux";
import { addCommand } from "@/features/commandStackSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mic, Send, Headphones } from "lucide-react";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isVADReady, setIsVADReady] = useState(false);
  const [isVADLoading, setIsVADLoading] = useState(true);
  const [isVADActive, setIsVADActive] = useState(false);
  const dispatch = useDispatch();

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

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB in bytes
  const MIN_AUDIO_SIZE = 512; // Minimum size of 0.5KB

  const sendCommandToBackend = useCallback(
    async (command: string) => {
      setIsProcessing(true);
      try {
        const response = await apiClient.post("/api/voice-commands", {
          command,
        });
        console.log("Command processed:", response.data);
      } catch (error) {
        console.error("Error sending command to backend:", error);
        setError("Failed to process command. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [setIsProcessing, setError]
  );

  const processVoiceCommand = useCallback(
    async (audioBlob: Blob) => {
      console.log("Processing voice command");
      setIsTranscribing(true);
      setError(null);
      try {
        console.log("Audio blob size:", audioBlob.size);

        if (audioBlob.size < MIN_AUDIO_SIZE) {
          throw new Error("Audio recording too short");
        }

        if (audioBlob.size > MAX_FILE_SIZE) {
          throw new Error("File size exceeds 25 MB limit");
        }

        const formData = new FormData();
        formData.append("audio", audioBlob, "voice_command.webm");
        formData.append("fileExtension", "webm");

        console.log("FormData entries:");
        for (const [key, value] of formData.entries()) {
          console.log(
            key,
            value instanceof Blob ? `Blob of size ${value.size}` : value
          );
        }

        const response = await apiClient.post("/api/voice-commands", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Server response:", response);
        console.log("Response data:", response.data);

        if (
          response.data.transcription &&
          Array.isArray(response.data.interpretedCommands)
        ) {
          const { transcription, interpretedCommands } = response.data;
          setInputValue(transcription);
          setIsTyping(transcription.length > 0);
          if (textareaRef.current) {
            textareaRef.current.value = transcription;
            textareaRef.current.dispatchEvent(
              new Event("input", { bubbles: true })
            );
          }
          adjustTextareaHeight();

          // Dispatch action to add multiple commands to Redux store
          const validActions = ["add", "update", "remove", "check"] as const;
          type ValidAction = (typeof validActions)[number];

          interpretedCommands.forEach(
            (interpretedCommand: {
              action: string;
              item: string;
              quantity: number;
              unit: string;
            }) => {
              if (
                validActions.includes(interpretedCommand.action as ValidAction)
              ) {
                console.log("Dispatching addCommand:", interpretedCommand);
                dispatch(
                  addCommand({
                    id:
                      Date.now().toString() +
                      Math.random().toString(36).substr(2, 9), // Generate a unique ID
                    action: interpretedCommand.action as ValidAction,
                    item: interpretedCommand.item,
                    quantity: interpretedCommand.quantity,
                    unit: interpretedCommand.unit,
                    processed: false,
                    rawCommand: transcription,
                  })
                );
              } else {
                console.error(`Invalid action: ${interpretedCommand.action}`);
              }
            }
          );
        } else {
          setError("Invalid response from server");
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
    [adjustTextareaHeight, MAX_FILE_SIZE, dispatch]
  );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
        audioBitsPerSecond: 128000,
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start(1000); // Capture audio in 1-second chunks
      setIsListening(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const vad = useMicVAD({
    onSpeechStart: () => {
      console.log("VAD: Speech started");
      if (isVADActive) {
        startRecording();
      }
    },
    onSpeechEnd: () => {
      console.log("VAD: Speech ended");
      if (isVADActive) {
        stopRecording();
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        processVoiceCommand(audioBlob);
        audioChunksRef.current = [];
      }
    },
    onVADMisfire: () => {
      if (isVADActive) {
        console.log("VAD: Misfire");
        stopRecording();
      }
    },
    modelURL: "/models/silero_vad.onnx",
    workletURL: "/models/vad.worklet.bundle.min.js",
  });

  const handleVoiceButtonClick = useCallback(() => {
    if (isVADActive) {
      vad.pause();
      setIsVADActive(false);
      setIsListening(false);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    } else {
      setIsVADActive(true);
      vad.start();
    }
  }, [vad, isVADActive]);

  useEffect(() => {
    console.log("VAD loading state:", vad.loading);
    setIsVADLoading(vad.loading);
    setIsVADReady(!vad.loading);
  }, [vad.loading]);

  const handleSend = useCallback(() => {
    if (textareaRef.current) {
      const command = textareaRef.current.value.trim();
      if (command) {
        sendCommandToBackend(command);
      }
    }
  }, [sendCommandToBackend]);

  const handleMicrophoneClick = useCallback(async () => {
    try {
      setIsListening(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "voice_command.webm");

        try {
          const response = await apiClient.post(
            "/api/transcribe-audio",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          setInputValue(response.data.transcription);
          setIsTyping(true);
          adjustTextareaHeight();
        } catch (error) {
          console.error("Transcription error:", error);
          setError("Failed to transcribe audio. Please try again.");
        }

        setIsListening(false);
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Failed to access microphone. Please check your permissions.");
      setIsListening(false);
    }
  }, [setInputValue, setIsTyping, adjustTextareaHeight, setError]);

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
      <div className="flex items-center space-x-2 relative">
        <Button variant="outline" size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>

        <div className="relative flex-grow">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Message"
            className="flex-grow bg-background max-h-[300px] overflow-y-auto w-full resize-none pr-10"
            style={{
              minHeight: "40px",
              height: "auto",
              maxHeight: "300px",
              overflowX: "hidden",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          />
          {!inputValue && (
            <button
              className="absolute right-2 bottom-2 p-1 text-gray-800"
              onClick={handleMicrophoneClick}
              disabled={isListening}
            >
              <Mic
                className={`h-4 w-4 ${
                  isListening ? "animate-pulse text-red-500" : ""
                }`}
              />
            </button>
          )}
        </div>

        {isTyping ? (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={handleSend}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className={`shrink-0 ${
              isVADActive
                ? "bg-red-400 text-white hover:bg-red-500 hover:text-white"
                : ""
            } ${vad.userSpeaking ? "animate-pulse" : ""}`}
            onClick={handleVoiceButtonClick}
            disabled={!isVADReady}
          >
            {isVADLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Headphones className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {isTranscribing && (
        <div className="text-sm text-gray-500 mt-2">Transcribing audio...</div>
      )}
      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
      {isListening && (
        <div className="text-sm text-gray-500 mt-2">
          {vad.userSpeaking ? "Listening..." : "Waiting for speech..."}
        </div>
      )}
    </div>
  );
}
