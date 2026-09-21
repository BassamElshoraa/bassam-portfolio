import InputText from "./components/InputText";
import UploadeFile from "./components/UploadeFile";
import TextareaInput from "./components/TextareaInput";

import { useEffect, useState } from "react";
import DataTable from "../DataTable";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { toast } from "react-toastify";
import TagsInput from "./components/TagsInput";

export const Accordion = ({ title, children, isOpen = false }) => {
  const [open, setOpen] = useState(isOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 transition-all duration-300 hover:shadow-md">
      <button
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`font-medium ${open ? "text-blue-600" : "text-gray-800"} transition-colors duration-200`}
        >
          {title}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-4 bg-white">{children}</div>
      </div>
    </div>
  );
};

export default function FormAccordion() {
  const actionData = useActionData();

  const projects = useLoaderData();
  const { state } = useNavigation();

  const isSubmittingLoading = state === "submitting" || state === "loading";

  useEffect(() => {
    if (actionData?.success) {
      toast(actionData.message, {
        progressClassName: "custom-progress-bar-success",
      });
    }
  }, [actionData]);

  return (
    <section className="max-w-3xl mx-auto p-4">
      <Form method="post" className="space-y-4" encType="multipart/form-data">
        <div className="flex gap-4 mb-4">
          <InputText type="text" name="title" placeholder="عنوان المشروع" />
          <UploadeFile name="image" />
        </div>
        <TextareaInput name="description" placeholder="وصف المشروع" />

        <div className="space-y-4">
          <InputText type="url" name="projectUrl" placeholder="رابط GitHub" />
          <InputText type="url" name="demoUrl" placeholder="رابط Demo" />
        </div>

        {/* <Accordion
          title="المهارات"
          //  isOpen={activeSection =
          // == "skills"}
        > */}

        <div className="col-span-full">
          <label
            htmlFor="cover-photo"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Cover photo
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              {/* <PhotoIcon
                aria-hidden="true"
                className="mx-auto size-12 text-gray-300"
              /> */}
              <div className="mt-4 flex text-sm/6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs/5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المهارات المستخدمة
            </label>
            <div className="flex flex-wrap gap-2">
              {["HTML", "CSS", "JavaScript", "React", "Node.js"].map(
                (skill) => (
                  <label key={skill} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="skills"
                      value={skill}
                      className="rounded text-blue-600"
                    />
                    <span>{skill}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>
        {/* </Accordion> */}

        <div className="bg-charcoal-black p-5 rounded-lg">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
            type="submit"
            disabled={isSubmittingLoading}
          >
            {isSubmittingLoading ? "جاري الإرسال..." : "حفظ المشروع"}
          </button>
          {/* <SubmitButton /> */}
          <TagsInput />
        </div>
      </Form>

      <DataTable data={projects} />
    </section>
  );
}
