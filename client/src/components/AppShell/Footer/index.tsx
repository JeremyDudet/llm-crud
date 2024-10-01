// src/components/layout/footer.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useMicVAD } from "@ricky0123/vad-react";
import apiClient from "@/api/apiClient";
import { useDispatch } from "react-redux";
import { addCommand } from "@/features/commandStackSlice";
import { Button } from "@/components/ui/button";
import { Send, AudioLines } from "lucide-react";
import FooterInputTextPrompt from "./FooterInputTextPrompt";

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
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingTranscription, setIsProcessingTranscription] =
    useState(false);
  const [isVADSpeechDetected, setIsVADSpeechDetected] = useState(false);

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
        const response = await apiClient.post("/api/process-text-command", {
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

        const response = await apiClient.post(
          "/api/process-command",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Server response:", response);
        console.log("Response data:", response.data);

        if (
          response.data.transcription &&
          Array.isArray(response.data.interpretedCommands)
        ) {
          const { transcription, interpretedCommands } = response.data;

          // Dispatch action to add multiple commands to Redux store
          const validActions = ["set", "add", "subtract"] as const;
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
                    id: interpretedCommand.id,
                    action: interpretedCommand.action as ValidAction,
                    itemName: interpretedCommand.item,
                    quantity: interpretedCommand.quantity,
                    unitOfMeasureName: interpretedCommand.unit,
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
    [MAX_FILE_SIZE, dispatch]
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
      setIsVADSpeechDetected(true);
      if (isVADActive) {
        startRecording();
      }
    },
    onSpeechEnd: () => {
      console.log("VAD: Speech ended");
      setIsVADSpeechDetected(false);
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

  const handleHeadphonesClick = useCallback(() => {
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

  const handleSendTextCommand = useCallback(() => {
    if (textareaRef.current) {
      const command = inputValue;
      if (command) {
        sendCommandToBackend(command);
      }
    }
  }, [sendCommandToBackend, inputValue]);

  const handleTranscribeAudio = useCallback(() => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
          };

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });
            const formData = new FormData();
            formData.append("audio", audioBlob, "voice_command.webm");

            try {
              setIsProcessingTranscription(true);
              const response = await apiClient.post(
                "/api/transcribe-audio",
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );
              setInputValue(response.data.transcription);
              adjustTextareaHeight();
            } catch (error) {
              console.error("Transcription error:", error);
              setError("Failed to transcribe audio. Please try again.");
            } finally {
              setIsProcessingTranscription(false);
            }

            // Stop all tracks on the stream to release the microphone
            stream.getTracks().forEach((track) => track.stop());
          };

          mediaRecorder.start();
          setIsRecording(true);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
          setError(
            "Failed to access microphone. Please check your permissions."
          );
        });
    }
  }, [isRecording, setInputValue, adjustTextareaHeight, setError]);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pb-4 bg-background pt-3">
      {/* <FooterSuggestedPrompts inputValue={inputValue} /> */}
      <div className="flex items-center space-x-2 relative">
        {/* <FooterAddMediaToPrompt /> */}
        <FooterInputTextPrompt
          textareaRef={textareaRef}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleTranscribeAudio={handleTranscribeAudio}
          isRecording={isRecording}
          isProcessingTranscription={isProcessingTranscription}
          isVADSpeechDetected={isVADSpeechDetected}
        />
        {inputValue ? (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={handleSendTextCommand}
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
            onClick={handleHeadphonesClick}
            disabled={!isVADReady}
          >
            {isVADLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <AudioLines className="h-4 w-4" />
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
