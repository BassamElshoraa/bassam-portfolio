export default function InputText({ name, type, accept }) {
  return (
    <label>
      <input
        type={type}
        name={name}
        id={name}
        accept={accept}
        className="rounded-2xl border border-jet w-full py-4 px-5 focus:border-bittersweet-shimmer outline-none"
      />
    </label>
  );
}
