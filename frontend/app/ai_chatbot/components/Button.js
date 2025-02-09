export function Button({ children, className, ...props }) {
    return (
      <button
        className={`px-4 py-2 bg-blue-500 text-white rounded-md transition hover:bg-blue-600 disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
}