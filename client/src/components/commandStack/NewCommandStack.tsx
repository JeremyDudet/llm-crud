import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Mic, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Command = {
  id: string;
  text: string;
  details: string;
  transcription: string;
};

export default function Component() {
  const [commands, setCommands] = useState<Command[]>([
    {
      id: "1",
      text: "Update Stevia & Paper Wrap",
      details: "0.5 box stevia, 10 packs paper wrap",
      transcription:
        "Set the inventory to half a box of stevia, 10 packs of paper wrap.",
    },
    {
      id: "2",
      text: "Restock Pens & Paper",
      details: "5 boxes pens, 3 reams printer paper",
      transcription:
        "Update the inventory to 5 boxes of pens and 3 reams of printer paper.",
    },
    {
      id: "3",
      text: "Order Office Supplies",
      details: "100 staplers, 50 hole punchers",
      transcription: "Place an order for 100 staplers and 50 hole punchers.",
    },
  ]);
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editedDetails, setEditedDetails] = useState("");
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [exitDirection, setExitDirection] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const toggleExpand = (id: string) => {
    setExpandedCommand(expandedCommand === id ? null : id);
  };

  const executeCommand = () => {
    if (commands.length > 0) {
      console.log(`Executing command: ${commands[0].id}`);
      setIsRemoving(true);
      setExitDirection(1);
      setTimeout(() => {
        setCommands((prevCommands) => prevCommands.slice(1));
        setIsRemoving(false);
        setExitDirection(0);
        setSwipeOffset(0);
      }, 300);
    }
  };

  const removeCommand = () => {
    if (commands.length > 0) {
      setIsRemoving(true);
      setExitDirection(-1);
      setTimeout(() => {
        setCommands((prevCommands) => prevCommands.slice(1));
        setIsRemoving(false);
        setExitDirection(0);
        setSwipeOffset(0);
      }, 300);
    }
  };

  const startEditing = () => {
    if (commands.length > 0) {
      setIsEditing(true);
      setEditedText(commands[0].text);
      setEditedDetails(commands[0].details);
    }
  };

  const saveEdit = () => {
    if (commands.length > 0) {
      setCommands((prevCommands) => [
        { ...prevCommands[0], text: editedText, details: editedDetails },
        ...prevCommands.slice(1),
      ]);
      setIsEditing(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    const maxSwipe = window.innerWidth * 0.4; // 40% of screen width
    const newOffset = Math.max(Math.min(diff, maxSwipe), -maxSwipe);
    setSwipeOffset(newOffset);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    const threshold = window.innerWidth * 0.3; // 30% of screen width
    if (swipeOffset > threshold) {
      executeCommand();
    } else if (swipeOffset < -threshold) {
      removeCommand();
    } else {
      setSwipeOffset(0);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsSwiping(false);
      setSwipeOffset(0);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <header className="p-4 bg-primary text-primary-foreground">
        <h1 className="text-2xl font-bold">Command Stack</h1>
      </header>
      <main className="flex-grow relative overflow-hidden px-4">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {commands.map((command, index) => (
            <div
              key={command.id}
              className={`w-full max-w-sm absolute transition-all duration-300 ease-out ${
                index === 0 ? "z-10" : `z-${10 - index}`
              }`}
              style={{
                transform: `translateY(${index * 20}px) scale(${
                  1 - index * 0.05
                })`,
                opacity: 1 - index * 0.2,
                pointerEvents: index === 0 ? "auto" : "none",
              }}
            >
              <Card
                className={`w-full shadow-lg transition-all duration-300 ease-out ${
                  isRemoving && index === 0 ? "opacity-0" : ""
                }`}
                style={{
                  transform:
                    index === 0
                      ? `translateX(${
                          isRemoving ? exitDirection * 100 : swipeOffset
                        }px) rotate(${swipeOffset * 0.03}deg)`
                      : "none",
                }}
                ref={index === 0 ? cardRef : undefined}
                onTouchStart={index === 0 ? handleTouchStart : undefined}
                onTouchMove={index === 0 ? handleTouchMove : undefined}
                onTouchEnd={index === 0 ? handleTouchEnd : undefined}
              >
                <CardContent className="p-6">
                  {index === 0 ? (
                    isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          className="font-medium"
                        />
                        <Input
                          value={editedDetails}
                          onChange={(e) => setEditedDetails(e.target.value)}
                          className="text-sm text-muted-foreground"
                        />
                        <Button onClick={saveEdit} className="w-full">
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-grow pr-2">
                            <h2 className="text-lg font-medium">
                              {command.text}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              {command.details}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleExpand(command.id)}
                          >
                            {expandedCommand === command.id ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}
                          </Button>
                        </div>
                        {expandedCommand === command.id && (
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Mic className="w-4 h-4 mr-2 flex-shrink-0" />
                            <p className="line-clamp-2">
                              {command.transcription}
                            </p>
                          </div>
                        )}
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={startEditing}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </>
                    )
                  ) : (
                    <>
                      <h2 className="text-lg font-medium">{command.text}</h2>
                      <p className="text-sm text-muted-foreground">
                        {command.details}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        {commands.length > 0 && (
          <>
            <div
              className="absolute top-0 left-0 h-full w-16 bg-green-500 flex items-center justify-center transition-opacity duration-300"
              style={{
                opacity: swipeOffset > window.innerWidth * 0.15 ? 1 : 0,
              }}
            >
              <Check className="text-white" size={24} />
            </div>
            <div
              className="absolute top-0 right-0 h-full w-16 bg-red-500 flex items-center justify-center transition-opacity duration-300"
              style={{
                opacity: swipeOffset < -window.innerWidth * 0.15 ? 1 : 0,
              }}
            >
              <X className="text-white" size={24} />
            </div>
          </>
        )}
      </main>
      {commands.length > 0 && (
        <footer className="p-4 bg-muted text-center text-sm text-muted-foreground">
          Swipe right to execute, left to delete
        </footer>
      )}
    </div>
  );
}
