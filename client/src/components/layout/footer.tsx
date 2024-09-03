import { useState, useEffect } from "react";
import { MessageCircle, ChevronUp, Send, Mic, MicOff } from "lucide-react";

export default function Footer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isListening] = useState(false);

  useState(false);

  useEffect(() => {
    setupSpeechRecognition();
  }, []);

  const setupSpeechRecognition = () => {
    // add code here later
  };

  // const toggleListening = () => {
  //     if (isListening) {
  //     recognitionRef.current?.stop();
  //     } else {
  //     recognitionRef.current?.start();
  //     }
  //     setIsListening(!isListening);
  // };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    setInputText("");
  };

  return (
    <div className="relative bg-gray-100">
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-2 bg-indigo-500 text-white">
          <button
            onClick={toggleDrawer}
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label="Toggle chat history"
          >
            <MessageCircle size={20} />
            <span className="text-sm font-medium">Chat History</span>
          </button>
          <div className="text-sm">
            <span className="font-medium">AI Status:</span> Ready
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center px-4 py-3 bg-gray-50"
        >
          <div className="relative flex-grow">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-2 pr-12 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          <button
            type="button"
            // onClick={toggleListening}
            className={`ml-2 p-2 rounded-full ${
              isListening ? "bg-red-500" : "bg-indigo-500"
            } text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </form>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg transition-transform duration-300 ease-in-out transform ${
          isDrawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "70%" }}
      >
        <div className="flex justify-center py-2">
          <button
            onClick={toggleDrawer}
            className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close chat history"
          >
            <ChevronUp size={24} />
          </button>
        </div>
        <div className="px-4 py-2 overflow-y-auto h-full">
          <h2 className="text-lg font-semibold mb-4 text-indigo-500">
            Conversation History
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-800">
                User: Hello, AI assistant!
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <p className="text-sm text-indigo-800">
                AI: Hello! How can I help you today?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
