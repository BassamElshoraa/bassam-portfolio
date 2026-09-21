import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <>
        <title>Page Not Found 404</title>
        <meta name="description" content="Page Not Found 404" />
        <meta property="og:title" content="Page Not Found 404" />
        <meta property="og:description" content="Page Not Found 404" />
        <meta name="keywords" content="404, not found, error" />

        {/* <meta name="author" content="Your Name" /> */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        {/* <meta name="theme-color" content="#000000" /> */}
        {/* <meta name="robots" content="noindex, nofollow" /> */}
        {/* <meta property="og:type" content="website" /> */}
        {/* <meta property="og:url" content="https://yourwebsite.com/404" /> */}
        {/* <meta property="og:image" content="https://yourwebsite.com/404-image.jpg" /> */}
      </>
      <section className="flex items-center justify-center min-h-screen bg-charcoal-black">
        <div className="w-[700px] text-center mx-auto max-w-full space-y-7 p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
            width={65}
            height={65}
            className="mx-auto"
          >
            <path
              fillRule="evenodd"
              d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z"
              clipRule="evenodd"
            ></path>
          </svg>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Page Not Found 404
            <br />
            It seems that you are looking for a page that does not exist.
          </h1>

          <Link
            to={`/`}
            className="cursor-pointer duration-300 transition-colors bg-jet rounded px-6 py-1 font-bold text-yellow-crayola hover:text-bittersweet-shimmer"
          >
            Back to the Home page
          </Link>
        </div>
      </section>
    </>
  );
}
