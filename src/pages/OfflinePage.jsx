import { FiWifiOff } from "react-icons/fi";
import { WiCloudyGusts } from "react-icons/wi";

export default function OfflinePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-charcoal-black p-6">
      <div className="max-w-md w-full bg-eerie-black-1 rounded-2xl shadow-lg p-8 text-center drop-shadow-md relative">
        {/* <div className="bg-white border border-red-200 rounded-2xl shadow-lg p-8 max-w-sm text-center"> */}
        <FiWifiOff className="mx-auto text-red-500 w-16 h-16 mb-4 animate-pulse" />
        <h1 className="text-2xl text-white font-semibold text-gray-800 mb-2">
          You are offline
        </h1>
        <p className="text-gray-600 mb-6">
          We can't load content at this time. Check your connection and try
          again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
