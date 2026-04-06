"use client";

export function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors"
    >
      Go Back
    </button>
  );
}
