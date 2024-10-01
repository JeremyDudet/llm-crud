import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  removeCommand,
  updateCommand,
  executeCommand,
  cycleCommandForward,
  cycleCommandBackward,
} from "@/features/commandStackSlice";
import { ChevronDown, ChevronUp, Mic, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function NewCommandStack() {
  const dispatch = useDispatch();
  const commands = useSelector(
    (state: RootState) => state.commandStack.commands
  );
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editedDetails, setEditedDetails] = useState("");
  const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState<"x" | "y" | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [exitDirection, setExitDirection] = useState({ x: 0, y: 0 });

  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const toggleExpand = (id: string) => {
    setExpandedCommand(expandedCommand === id ? null : id);
  };

  const executeCurrentCommand = () => {
    if (commands.length > 0) {
      dispatch(executeCommand(commands[0].id));
      setIsRemoving(true);
      setExitDirection({ x: 1, y: 0 });
      setTimeout(() => {
        dispatch(removeCommand(commands[0].id));
        setIsRemoving(false);
        setExitDirection({ x: 0, y: 0 });
        setSwipeOffset({ x: 0, y: 0 });
        setSwipeDirection(null);
      }, 300);
    }
  };

  const removeCurrentCommand = () => {
    if (commands.length > 0) {
      setIsRemoving(true);
      setExitDirection({ x: -1, y: 0 });
      setTimeout(() => {
        dispatch(removeCommand(commands[0].id));
        setIsRemoving(false);
        setExitDirection({ x: 0, y: 0 });
        setSwipeOffset({ x: 0, y: 0 });
        setSwipeDirection(null);
      }, 300);
    }
  };

  const moveCommandForward = () => {
    if (commands.length > 0) {
      setIsRemoving(true);
      setExitDirection({ x: 0, y: -1 });
      setTimeout(() => {
        dispatch(cycleCommandForward());
        setIsRemoving(false);
        setExitDirection({ x: 0, y: 0 });
        setSwipeOffset({ x: 0, y: 0 });
        setSwipeDirection(null);
      }, 300);
    }
  };

  const moveCommandBackward = () => {
    if (commands.length > 0) {
      setIsRemoving(true);
      setExitDirection({ x: 0, y: 1 });
      setTimeout(() => {
        dispatch(cycleCommandBackward());
        setIsRemoving(false);
        setExitDirection({ x: 0, y: 0 });
        setSwipeOffset({ x: 0, y: 0 });
        setSwipeDirection(null);
      }, 300);
    }
  };

  const startEditing = () => {
    if (commands.length > 0) {
      setIsEditing(true);
      setEditedText(commands[0].rawCommand);
      setEditedDetails(
        `${commands[0].action} ${commands[0].quantity ?? ""} ${
          commands[0].unit ?? ""
        } of ${commands[0].item}`
      );
    }
  };

  const saveEdit = () => {
    if (commands.length > 0) {
      dispatch(
        updateCommand({
          id: commands[0].id,
          changes: {
            rawCommand: editedText,
            // You might need to parse editedDetails to update action, quantity, unit, and item
          },
        })
      );
      setIsEditing(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setIsSwiping(true);
    setSwipeDirection(null);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startPos.current.x;
    const diffY = currentY - startPos.current.y;
    const maxSwipe = {
      x: window.innerWidth * 0.4,
      y: window.innerHeight * 0.2,
    };

    if (!swipeDirection) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        setSwipeDirection("x");
      } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
        setSwipeDirection("y");
      }
    }

    if (swipeDirection === "x") {
      setSwipeOffset({
        x: Math.max(Math.min(diffX, maxSwipe.x), -maxSwipe.x),
        y: 0,
      });
    } else if (swipeDirection === "y") {
      setSwipeOffset({
        x: 0,
        y: Math.max(Math.min(diffY, maxSwipe.y), -maxSwipe.y),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    const threshold = {
      x: window.innerWidth * 0.3,
      y: window.innerHeight * 0.15,
    };
    if (swipeDirection === "x") {
      if (swipeOffset.x > threshold.x) {
        executeCurrentCommand();
      } else if (swipeOffset.x < -threshold.x) {
        removeCurrentCommand();
      } else {
        setSwipeOffset({ x: 0, y: 0 });
      }
    } else if (swipeDirection === "y") {
      if (swipeOffset.y > threshold.y) {
        moveCommandForward();
      } else if (swipeOffset.y < -threshold.y) {
        moveCommandBackward();
      } else {
        setSwipeOffset({ x: 0, y: 0 });
      }
    }
    setSwipeDirection(null);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsSwiping(false);
      setSwipeOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <main className="flex-grow relative overflow-hidden px-4">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence>
            {commands.map((command, index) => (
              <motion.div
                key={command.id}
                className={`w-full max-w-sm absolute ${
                  index === 0 ? "z-10" : `z-${10 - index}`
                }`}
                initial={
                  index === 0
                    ? { scale: 0.8, y: 50, opacity: 0 }
                    : { scale: 1, y: index * 10, opacity: 1 - index * 0.2 }
                }
                animate={
                  index === 0
                    ? {
                        scale: 1,
                        opacity: 1,
                        x: swipeOffset.x,
                        y: swipeOffset.y,
                        rotateZ: swipeOffset.x * 0.05,
                      }
                    : {
                        scale: 1 - index * 0.05,
                        y: index * 10,
                        opacity: 1 - index * 0.2,
                        x: 0,
                        rotateZ: 0,
                      }
                }
                exit={
                  index === 0
                    ? {
                        scale: 0.8,
                        opacity: 0,
                        filter: "blur(10px)",
                        x: exitDirection.x * window.innerWidth,
                        y: exitDirection.y * window.innerHeight,
                        transition: { duration: 0.3, ease: "easeInOut" },
                      }
                    : {}
                }
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  pointerEvents: index === 0 ? "auto" : "none",
                }}
              >
                <Card
                  className="w-full shadow-lg overflow-hidden"
                  ref={index === 0 ? cardRef : undefined}
                  onTouchStart={index === 0 ? handleTouchStart : undefined}
                  onTouchMove={index === 0 ? handleTouchMove : undefined}
                  onTouchEnd={index === 0 ? handleTouchEnd : undefined}
                >
                  <CardContent className="p-6 relative">
                    {index === 0 && (
                      <>
                        <motion.div
                          className="absolute inset-y-0 left-0 w-1 bg-green-500"
                          initial={{ scaleY: 0 }}
                          animate={{
                            scaleY:
                              swipeDirection === "x" && swipeOffset.x > 0
                                ? Math.min(swipeOffset.x / 100, 1)
                                : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                        <motion.div
                          className="absolute inset-y-0 right-0 w-1 bg-red-500"
                          initial={{ scaleY: 0 }}
                          animate={{
                            scaleY:
                              swipeDirection === "x" && swipeOffset.x < 0
                                ? Math.min(-swipeOffset.x / 100, 1)
                                : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                        <motion.div
                          className="absolute inset-x-0 bottom-0 h-1 bg-blue-500"
                          initial={{ scaleX: 0 }}
                          animate={{
                            scaleX:
                              swipeDirection === "y" && swipeOffset.y > 0
                                ? Math.min(swipeOffset.y / 50, 1)
                                : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                        <motion.div
                          className="absolute inset-x-0 top-0 h-1 bg-yellow-500"
                          initial={{ scaleX: 0 }}
                          animate={{
                            scaleX:
                              swipeDirection === "y" && swipeOffset.y < 0
                                ? Math.min(-swipeOffset.y / 50, 1)
                                : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      </>
                    )}
                    <motion.div
                      initial={{ opacity: 1, filter: "blur(0px)" }}
                      animate={{
                        opacity: isRemoving ? 0 : 1,
                        filter: isRemoving ? "blur(10px)" : "blur(0px)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {index === 0 && isEditing ? (
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
                                {command.rawCommand}
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                {command.action} {command.quantity}{" "}
                                {command.unit} of {command.item}
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
                          <AnimatePresence>
                            {expandedCommand === command.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 30,
                                }}
                                className="flex items-center text-sm text-muted-foreground mb-2 overflow-hidden"
                              >
                                <Mic className="w-4 h-4 mr-2 flex-shrink-0" />
                                <p className="line-clamp-2">
                                  {command.rawCommand}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {index === 0 && (
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
                          )}
                        </>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
      {/* <footer className="p-4 bg-muted text-center text-sm text-muted-foreground">
        Swipe right to execute, left to delete, up/down to cycle
      </footer> */}
    </div>
  );
}
