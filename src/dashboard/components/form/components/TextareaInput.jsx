export default function TextareaInput({ name }) {
  return (
    <textarea
      name={name}
      id={name}
      className="rounded-2xl border border-jet w-full py-4 px-5 focus:border-bittersweet-shimmer outline-none"
      placeholder="Description..."
      rows="4"
      cols="50"
    ></textarea>
  );
}
