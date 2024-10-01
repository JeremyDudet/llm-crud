import { Textarea } from "@/components/ui/textarea";
import { Mic, Loader2, CircleStop } from "lucide-react";

function FooterInputTextPrompt({
  textareaRef,
  inputValue,
  handleInputChange,
  handleTranscribeAudio,
  isRecording,
  isProcessingTranscription,
  isVADSpeechDetected,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  inputValue: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleTranscribeAudio: () => void;
  isRecording: boolean;
  isProcessingTranscription: boolean;
  isVADSpeechDetected: boolean;
}) {
  return (
    <div className="relative flex-grow">
      <Textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Prompt"
        className="flex-grow bg-background max-h-[300px] overflow-y-auto w-full resize-none pr-7"
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
          onClick={handleTranscribeAudio}
          disabled={isProcessingTranscription}
        >
          {isProcessingTranscription ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRecording ? (
            <CircleStop
              className={`h-5 w-5  ${
                isVADSpeechDetected ? "animate-pulse" : ""
              }`}
            />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}

export default FooterInputTextPrompt;
