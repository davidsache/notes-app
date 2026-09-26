import { useState } from "react";
import { useTags } from "../../hooks/useTags";

interface CreateTagProps {
  refetchTags: () => void;
}

export const CreateTag: React.FC<CreateTagProps> = ({ refetchTags }) => {
  const { addTag } = useTags();
  const [currentInput, setCurrentInput] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleCreateTag = async () => {
    if (currentInput) {
      setSubmitting(true);

      await addTag(currentInput);
      refetchTags();

      setCurrentInput('');
      setSubmitting(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 50);
    setCurrentInput(sanitizedValue);
  };

  return (
    <div className="my-2">
      <input 
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        placeholder="Tag name"
        className="border-2 border-slate-300 rounded-md outline-none mb-3 p-2"
        maxLength={50}
        disabled={submitting}
      />
      <button 
        className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold px-2 py-1 rounded"
        onClick={handleCreateTag}
        disabled={!currentInput || submitting}
      >
        Add Tag
      </button>
    </div>
  );
}