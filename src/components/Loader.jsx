import PageLayout from "../layout/PageLayout";

export default function Loader() {
  return (
    // <PageLayout>
    <section className="w-full min-h-56 color-and-padding-component self-stretch place-content-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-yellow-crayola mx-auto"
        // role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </section>
    // </PageLayout>
  );
}
