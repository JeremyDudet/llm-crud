import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

export function useVoiceCommand() {
  const [isListening, setIsListening] = useState(false);

  const voiceCommandMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice_command.webm");
      const response = await apiClient.post("/voice-command", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });

  const startListening = () => setIsListening(true);
  const stopListening = () => setIsListening(false);

  const processVoiceCommand = async (audioBlob: Blob) => {
    try {
      const result = await voiceCommandMutation.mutateAsync(audioBlob);
      return result;
    } catch (error) {
      console.error("Error processing voice command:", error);
      throw error;
    }
  };

  return {
    isListening,
    startListening,
    stopListening,
    processVoiceCommand,
    isProcessing: voiceCommandMutation.isPending,
    error: voiceCommandMutation.error,
  };
}
