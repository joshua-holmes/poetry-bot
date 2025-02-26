import { useSetAtom } from "jotai";
import { examplePrompts, inputFieldAtom } from "../../constants";

function EmptyState() {
  const setInputField = useSetAtom(inputFieldAtom);

  const handleClick = (example: string) => {
    const textArea = document.getElementById("message-input");
    if (!textArea) {
      console.error("Failed to find text area to input text:", example);
      return;
    }
    textArea.textContent = example;
    setInputField(example);
  }

  return (
    <div className="empty-state">
      <div className="empty-state-avatar">👩‍🎨</div>
      <div className="empty-state-greeting">Hi, I'm Clara!</div>
      <div className="empty-state-examples">
        {
          examplePrompts.map((ex, i) => (
            <div
              key={`empty-state example ${i}: ${ex}`}
              className="example-pill"
              onClick={() => handleClick(ex)}
            >
              {ex}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default EmptyState;
