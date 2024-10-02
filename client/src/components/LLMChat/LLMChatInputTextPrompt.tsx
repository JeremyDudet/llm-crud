import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, Loader2, CircleStop } from "lucide-react";

function FooterInputTextPrompt({
  textareaRef,
  inputValue,
  handleInputChange,
  handleTranscribeAudio,
  isRecording,
  isProcessingTranscription,
  isVADSpeechDetected,
  onFocus,
  onBlur,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  inputValue: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleTranscribeAudio: () => void;
  isRecording: boolean;
  isProcessingTranscription: boolean;
  isVADSpeechDetected: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <div className="relative flex-grow">
      <Textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Ask anything..."
        className="flex-grow bg-transparent max-h-[300px] overflow-y-auto w-full resize-none pr-7 border-none focus:outline-none focus:ring-0"
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
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 bottom-0 p-1 bg-transparent text-gray-800 hover:bg-slate-100"
          onClick={handleTranscribeAudio}
          disabled={isProcessingTranscription}
        >
          {isProcessingTranscription ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRecording ? (
            <CircleStop
              className={`h-4 w-4  ${
                isVADSpeechDetected ? "animate-pulse" : ""
              }`}
            />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}

export default FooterInputTextPrompt;
