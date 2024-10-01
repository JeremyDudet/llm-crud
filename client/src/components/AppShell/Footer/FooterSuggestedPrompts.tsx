import { Button } from "./ui/button";

function FooterSuggestedPrompts({ inputValue }: { inputValue: string }) {
  return (
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
      {!inputValue && (
        <>
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
        </>
      )}
    </div>
  );
}

export default FooterSuggestedPrompts;
