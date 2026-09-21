import { FaCloudUploadAlt } from "react-icons/fa";
import { useState } from "react";

export default function UploadFile({ name }) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append(name, file);

      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="p-3 rounded-full bg-gray-100">
          <FaCloudUploadAlt size={20} className="text-gray-600" />
        </div>
        <span className="text-gray-700">{fileName || "اختر ملف للرفع"}</span>
        <input
          type="file"
          name={name}
          id={name}
          onChange={handleFileChange}
          accept=".jpg, .jpeg, .png"
          multiple
          hidden
          // className="hidden"
        />
      </label>

      {fileName && (
        <div className="text-sm text-gray-500">الملف المختار: {fileName}</div>
      )}
    </div>
  );
}
