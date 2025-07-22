const ErrorPage = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
        <p className="text-gray-600 mt-2">{error?.message || "An unexpected error occurred"}</p>
        <button
          onClick={() => window.location.href = "/"}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;