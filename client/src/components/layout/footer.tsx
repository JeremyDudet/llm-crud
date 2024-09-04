import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mic, Headphones, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Footer() {
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsTyping(e.target.value.length > 0);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", adjustTextareaHeight);
    return () => window.removeEventListener("resize", adjustTextareaHeight);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background">
      <div
        className="flex space-x-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide"
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
      </div>
      <div className="flex items-center space-x-2">
        {!isTyping && (
          <Button variant="outline" size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        )}
        <Textarea
          ref={textareaRef}
          placeholder="Message"
          className="flex-grow bg-background min-h-[40px] max-h-[200px] resize-none overflow-hidden"
          onChange={handleInputChange}
          rows={1}
        />
        {isTyping ? (
          <Button variant="outline" size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button variant="outline" size="icon" className="shrink-0">
              <Mic className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="shrink-0">
              <Headphones className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
