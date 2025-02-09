export function Input({ className, ...props }) {
    return (
      <input
        className={`w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    );
  }