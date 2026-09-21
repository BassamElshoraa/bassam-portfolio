export default function Heading({ title }) {
  return (
    <h1 className="relative font-bold text-[32px] mb-5 pb-5 before:absolute before:w-10 before:h-1.5 before:bg-yellow-crayola before:rounded-2xl before:bottom-0">
      {title}
    </h1>
  );
}
