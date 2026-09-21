import { useState } from "react";

export default function TagsInput() {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === " ") && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
        setInput("");
      }
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="flex flex-wrap items-center gap-2 border border-gray-300 p-3 rounded-md">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
          >
            <span>{tag}</span>
            <button
              onClick={() => removeTag(index)}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              &times;
            </button>
          </div>
        ))}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="أدخل كلمة واضغط Enter"
          className="flex-grow outline-none border-none bg-transparent text-sm"
        />
      </div>
    </div>
  );
}
