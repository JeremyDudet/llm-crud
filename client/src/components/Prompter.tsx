import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const AIComponent: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [voiceActive, setVoiceActive] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleVoiceCommand = () => {
    setVoiceActive((prevState) => !prevState);
    // Logic to handle voice commands can be implemented here
  };

  const handleSubmit = () => {
    // Implement your CRUD operation logic here
    console.log("Submitted input:", input);
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 mb-4 mx-4 shadow-lg">
      <CardContent>
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your command..."
          className="w-full mb-2"
        />
        <div className="flex justify-between">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={handleVoiceCommand}>
            {voiceActive ? "Stop Listening" : "Start Voice Command"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIComponent;
