import { useState } from "react";
import { useTags } from "../../hooks/useTags";
import { ErrorText } from "../ErrorText";

interface CreateTagProps {
  refetchTags: () => void;
}

export const CreateTag: React.FC<CreateTagProps> = ({ refetchTags }) => {
  const { addTag } = useTags();
  const [currentInput, setCurrentInput] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string>('');

  const handleCreateTag = async () => {
    if (currentInput) {
      setInputError('');
      setSubmitting(true);

      await addTag(currentInput);
      refetchTags();

      setCurrentInput('');
      setSubmitting(false);
    }
    else {
      setInputError("Tag name field can't be empty.");
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputError) setInputError('');
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
      {inputError && (
        <div className="mb-2"><ErrorText error={inputError} darkerText={false}/></div>
      )}
      <button 
        className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold px-2 py-1 rounded"
        onClick={handleCreateTag}
        disabled={submitting}
      >
        Add Tag
      </button>
    </div>
  );
}