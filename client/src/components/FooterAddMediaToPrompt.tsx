import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function FooterAddMediaToPrompt() {
  return (
    <Button variant="outline" size="icon" className="shrink-0">
      <Plus className="h-4 w-4" />
    </Button>
  );
}

export default FooterAddMediaToPrompt;
