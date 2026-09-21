import { FiAlertCircle, FiHome } from "react-icons/fi";
import {
  useRouteError,
  isRouteErrorResponse,
  Link,
  useNavigate,
} from "react-router";

const ErrorDisplay = ({ title, message, details, status, data }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-charcoal-black p-4">
      <div className="max-w-md w-full bg-eerie-black-1 rounded-2xl shadow-lg p-8 text-center drop-shadow-md relative">
        <div className="absolute inset-1 bg-eerie-black-1 rounded-xl -z-10 border-t border-l border-dark-charcoal"></div>
        {status && (
          <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold text-red-800 bg-red-100 rounded-full">
            {status}
          </span>
        )}
        <FiAlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h1 className="text-3xl font-extrabold text-white mb-2">{title}</h1>
        {message && <p className="text-gray-600 mb-6">{message}</p>}

        {details && (
          <div className="p-3 rounded text-sm text-gray-600">
            <p>{details}</p>
          </div>
        )}

        {data && (
          <div className="p-3 rounded text-sm text-gray-600">
            <p>{data}</p>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 hover:bg-bittersweet-shimmer hover:text-white rounded-lg cursor-pointer transition"
          >
            ← Back
          </button>

          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-yellow-crayola bg-gradient-onyx border border-gray-border hover:bg-yellow-crayola hover:text-black rounded-lg transition"
          >
            <FiHome className="mr-2 h-5 w-5" />
            Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorDisplay
        status={error.status}
        title={`Error ${error.status}`}
        message={error.statusText}
        details={error.data?.message}
        data={error.data}
      />
    );
  } else if (error instanceof Error) {
    return (
      <ErrorDisplay
        title="An unexpected error occurred"
        message={error.message}
      />
    );
  } else {
    return <ErrorDisplay title="An unknown error has occurred" />;
  }
}
