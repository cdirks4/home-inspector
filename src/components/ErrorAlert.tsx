"use client";

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

export function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div
      className="relative flex items-center p-4 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 transform transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-2"
      role="alert"
    >
      <div className="mr-12">{message}</div>
      <button
        onClick={onClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg inline-flex items-center justify-center hover:bg-red-200/50 dark:hover:bg-red-800/50 transition-colors"
        aria-label="Close alert"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
