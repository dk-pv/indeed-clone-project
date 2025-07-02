export default function ProgressIndicator({ activeForm }) {
  const forms = [
    { id: "account", label: "Account" },
    { id: "job", label: "Job Info" },
    { id: "details", label: "Details" },
    { id: "payBenefits", label: "Pay & Benefits" },
    { id: "preferences", label: "Preferences" },
    { id: "preview", label: "Preview" },
  ];

  const getCurrentIndex = () => forms.findIndex((f) => f.id === activeForm);

  const getStepStatus = (index) => {
    const currentIndex = getCurrentIndex();

    if (index === currentIndex) {
      return "active";
    } else if (index < currentIndex) {
      return "completed";
    } else {
      return "upcoming";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Create Your Job Post
        </h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>

        {/* Active Progress Line */}
        <div
          className="absolute top-8 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${(getCurrentIndex() / (forms.length - 1)) * 100}%`,
          }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between items-center">
          {forms.map((form, index) => {
            const status = getStepStatus(index);

            return (
              <div key={form.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`
                  w-16 h-16 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300
                  ${
                    status === "completed"
                      ? "bg-blue-600 text-white"
                      : status === "active"
                      ? "bg-blue-600 text-white ring-4 ring-blue-200"
                      : "bg-white border-2 border-gray-300 text-gray-500"
                  }
                `}
                >
                  {status === "completed" ? (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-4 text-center">
                  <span
                    className={`
                    text-sm font-medium transition-colors duration-200
                    ${
                      status === "active"
                        ? "text-blue-600 font-semibold"
                        : status === "completed"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }
                  `}
                  >
                    {form.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Counter */}
      <div className="text-center mt-8">
        <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          Step {getCurrentIndex() + 1} of {forms.length}
        </span>
      </div>
    </div>
  );
}
