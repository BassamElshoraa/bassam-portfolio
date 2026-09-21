import Heading from "../components/Heading";

export default function PageLayout({ title, children }) {
  return (
    // w-4xl w-full max-w-full
    <section className="color-and-padding-component p-6 relative">
      <Heading title={title} />
      {children}
    </section>
  );
}
